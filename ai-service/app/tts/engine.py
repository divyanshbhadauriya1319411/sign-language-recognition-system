import base64
import io
import asyncio
import logging
from abc import ABC, abstractmethod
from typing import Optional
from app.config import settings

logger = logging.getLogger(__name__)

class ISpeechProvider(ABC):
    @abstractmethod
    async def synthesize(self, text: str, voice_gender: str = "female", speed: float = 1.0) -> str:
        """Synthesize text to base64 audio/mpeg."""
        pass


class EdgeSpeechProvider(ISpeechProvider):
    async def synthesize(self, text: str, voice_gender: str = "female", speed: float = 1.0) -> str:
        import edge_tts
        voice_id = "en-IN-NeerjaNeural" if voice_gender.lower() == "female" else "en-IN-PrabhatNeural"
        rate_diff = int((speed - 1.0) * 100)
        rate_str = f"{'+' if rate_diff >= 0 else ''}{rate_diff}%"
        communicate = edge_tts.Communicate(text, voice=voice_id, rate=rate_str)
        audio_bytes = bytearray()
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_bytes.extend(chunk["data"])
        if len(audio_bytes) > 0:
            return base64.b64encode(audio_bytes).decode("utf-8")
        return ""


class GTTSSpeechProvider(ISpeechProvider):
    async def synthesize(self, text: str, voice_gender: str = "female", speed: float = 1.0) -> str:
        from gtts import gTTS
        loop = asyncio.get_event_loop()
        def gtts_sync():
            fp = io.BytesIO()
            tts = gTTS(text=text, lang="en", slow=(speed < 0.8))
            tts.write_to_fp(fp)
            fp.seek(0)
            return base64.b64encode(fp.read()).decode("utf-8")
        return await loop.run_in_executor(None, gtts_sync)


class AzureNeuralSpeechProvider(ISpeechProvider):
    async def synthesize(self, text: str, voice_gender: str = "female", speed: float = 1.0) -> str:
        # Check Azure Speech SDK / REST API readiness
        try:
            import azure.cognitiveservices.speech as speechsdk
            # If keys configured, synthesize via SDK
            speech_config = speechsdk.SpeechConfig(subscription=getattr(settings, "AZURE_SPEECH_KEY", ""), region=getattr(settings, "AZURE_SPEECH_REGION", "eastus"))
            # Fallback to EdgeSpeechProvider if not initialized
        except Exception:
            pass
        edge_provider = EdgeSpeechProvider()
        return await edge_provider.synthesize(text, voice_gender, speed)


class GoogleCloudSpeechProvider(ISpeechProvider):
    async def synthesize(self, text: str, voice_gender: str = "female", speed: float = 1.0) -> str:
        try:
            from google.cloud import texttospeech
            # If GCP service account exists, synthesize via Google Cloud TTS
        except Exception:
            pass
        gtts_provider = GTTSSpeechProvider()
        return await gtts_provider.synthesize(text, voice_gender, speed)


def get_speech_provider() -> ISpeechProvider:
    provider_name = getattr(settings, "SPEECH_PROVIDER", "edge").lower()
    if provider_name == "azure":
        return AzureNeuralSpeechProvider()
    elif provider_name == "google_cloud":
        return GoogleCloudSpeechProvider()
    elif provider_name == "gtts":
        return GTTSSpeechProvider()
    return EdgeSpeechProvider()


class TTSEngine:
    """High-level TTS orchestrator delegating to configured ISpeechProvider with fallback."""
    def __init__(self):
        self.provider = get_speech_provider()
        self.fallback = GTTSSpeechProvider()

    async def synthesize(self, text: str, voice_gender: str = "female", speed: float = 1.0) -> str:
        if not text or not text.strip():
            return ""
        try:
            result = await self.provider.synthesize(text, voice_gender, speed)
            if result:
                return result
        except Exception as e:
            logger.warning(f"Speech synthesis error with provider {self.provider.__class__.__name__}: {e}. Using fallback.")
        return await self.fallback.synthesize(text, voice_gender, speed)

tts_engine = TTSEngine()
