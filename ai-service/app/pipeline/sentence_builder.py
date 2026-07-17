import time
import threading
from typing import Dict, List, Any, Optional
from app.config import settings

class ContinuousSentenceBuilder:
    """
    Continuous Sentence Builder & Grammar Engine for ISL sequence predictions.
    Maintains per-session word token buffers, applies debounce cooldown between identical tokens,
    detects neutral resting pose pauses (>1.2s) for sentence completion, and converts sign glosses
    into formatted natural language sentences with proper capitalization and punctuation.
    """
    def __init__(self):
        self.sessions: Dict[str, Dict[str, Any]] = {}
        self.lock = threading.Lock()
        # Common interrogative words that should terminate with '?'
        self.question_words = {"WHO", "WHAT", "WHERE", "WHEN", "WHY", "HOW", "WHICH"}

    def _get_or_create_session(self, session_id: str) -> Dict[str, Any]:
        if session_id not in self.sessions:
            self.sessions[session_id] = {
                "tokens": [],
                "last_token": "",
                "last_token_time": 0.0,
                "last_activity_time": time.time(),
                "is_sentence_final": False,
                "history": []
            }
        return self.sessions[session_id]

    def add_token(self, session_id: str, gesture_token: str, confidence: float = 1.0) -> Dict[str, Any]:
        """
        Evaluates a newly confirmed sign gesture from the prediction pipeline.
        If valid, appends to the active sentence buffer while respecting debounce cooldowns.
        If an IDLE/UNKNOWN rest state persists > 1.2s, marks the current buffer as a finalized sentence.
        """
        now = time.time()
        with self.lock:
            session = self._get_or_create_session(session_id)
            
            # Check for neutral / non-sign boundaries or idle
            if gesture_token in ("No Sign Detected", "Unknown Gesture", "IDLE_NON_SIGN", "IDLE_OR_UNKNOWN", "Searching for hands...", "Initializing Model..."):
                # If hands are resting/idle and time since last active sign exceeds pause threshold
                if len(session["tokens"]) > 0 and not session["is_sentence_final"]:
                    if (now - session["last_activity_time"]) >= settings.PAUSE_THRESHOLD_SECONDS:
                        session["is_sentence_final"] = True
                        formatted = self._format_tokens(session["tokens"], is_final=True)
                        session["history"].append(formatted)
                return self._build_response(session)

            # Active sign recognized
            session["last_activity_time"] = now

            # If the previous sentence was finalized, start a fresh token buffer for the new sentence
            if session["is_sentence_final"]:
                session["tokens"] = []
                session["is_sentence_final"] = False
                session["last_token"] = ""

            clean_token = gesture_token.strip().upper()

            # Apply debounce cooldown timer (e.g. 250ms) to prevent duplicate stuttering ("HELP HELP HELP")
            if clean_token == session["last_token"]:
                if (now - session["last_token_time"]) < settings.DEBOUNCE_COOLDOWN_SECONDS:
                    # Within cooldown window; refresh timer but do not append duplicate token
                    session["last_token_time"] = now
                    return self._build_response(session)

            # New or distinct token (or cooldown elapsed)
            session["tokens"].append(gesture_token.strip())
            session["last_token"] = clean_token
            session["last_token_time"] = now

            return self._build_response(session)

    def check_pause_boundary(self, session_id: str) -> Dict[str, Any]:
        """
        Periodically checks whether an active sentence should be finalized due to inactivity (>1.2s).
        """
        now = time.time()
        with self.lock:
            session = self._get_or_create_session(session_id)
            if len(session["tokens"]) > 0 and not session["is_sentence_final"]:
                if (now - session["last_activity_time"]) >= settings.PAUSE_THRESHOLD_SECONDS:
                    session["is_sentence_final"] = True
                    formatted = self._format_tokens(session["tokens"], is_final=True)
                    session["history"].append(formatted)
            return self._build_response(session)

    def undo_last_token(self, session_id: str) -> Dict[str, Any]:
        """Pops the last recognized sign token from the active sentence buffer."""
        with self.lock:
            session = self._get_or_create_session(session_id)
            if session["tokens"]:
                session["tokens"].pop()
                session["last_token"] = session["tokens"][-1].upper() if session["tokens"] else ""
            if session["is_sentence_final"] and not session["tokens"]:
                session["is_sentence_final"] = False
            return self._build_response(session)

    def clear_active_sentence(self, session_id: str) -> Dict[str, Any]:
        """Clears all tokens from the active sentence buffer."""
        with self.lock:
            session = self._get_or_create_session(session_id)
            session["tokens"] = []
            session["last_token"] = ""
            session["is_sentence_final"] = False
            return self._build_response(session)

    def get_sentence_state(self, session_id: str) -> Dict[str, Any]:
        with self.lock:
            session = self._get_or_create_session(session_id)
            return self._build_response(session)

    def clear_session(self, session_id: str) -> None:
        with self.lock:
            if session_id in self.sessions:
                del self.sessions[session_id]

    def _format_tokens(self, tokens: List[str], is_final: bool = False) -> str:
        if not tokens:
            return ""
        
        # Basic grammar formatting: combine tokens
        words = [t.strip() for t in tokens if t and t.strip()]
        if not words:
            return ""

        # Capitalize first word properly and lowercase/title-case remaining words if they are all caps glosses
        formatted_words = []
        for idx, w in enumerate(words):
            if idx == 0:
                formatted_words.append(w.capitalize() if w.isupper() else w)
            else:
                formatted_words.append(w.lower() if w.isupper() and len(w) > 1 else w)

        sentence = " ".join(formatted_words)

        if is_final:
            # Check if sentence is a question based on interrogative words
            has_question = any(w.upper() in self.question_words for w in words)
            terminal_char = "?" if has_question else "."
            if not sentence.endswith((".", "?", "!")):
                sentence += terminal_char

        return sentence

    def _build_response(self, session: Dict[str, Any]) -> Dict[str, Any]:
        formatted = self._format_tokens(session["tokens"], is_final=session["is_sentence_final"])
        return {
            "tokens": list(session["tokens"]),
            "formatted_sentence": formatted,
            "is_sentence_final": session["is_sentence_final"],
            "history": list(session["history"])
        }

sentence_builder = ContinuousSentenceBuilder()
