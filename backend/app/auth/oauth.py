from abc import ABC, abstractmethod
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

class IOAuthProvider(ABC):
    @abstractmethod
    async def get_authorization_url(self, state: str) -> str:
        pass

    @abstractmethod
    async def verify_authorization_code(self, code: str) -> Optional[Dict[str, Any]]:
        """Return user profile: { 'email': str, 'full_name': str, 'oauth_id': str, 'avatar_url': str }"""
        pass


class GoogleOAuthProvider(IOAuthProvider):
    async def get_authorization_url(self, state: str) -> str:
        return f"https://accounts.google.com/o/oauth2/v2/auth?client_id=GOOGLE_CLIENT_ID&redirect_uri=CALLBACK&response_type=code&scope=email%20profile&state={state}"

    async def verify_authorization_code(self, code: str) -> Optional[Dict[str, Any]]:
        # Mock/ready exchange
        logger.info("Google OAuth: verifying authorization code")
        return {"email": "google_user@example.com", "full_name": "Google Authenticated User", "oauth_id": f"google_{code[:10]}", "avatar_url": None}


class MicrosoftOAuthProvider(IOAuthProvider):
    async def get_authorization_url(self, state: str) -> str:
        return f"https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=MS_CLIENT_ID&response_type=code&state={state}"

    async def verify_authorization_code(self, code: str) -> Optional[Dict[str, Any]]:
        logger.info("Microsoft OAuth: verifying authorization code")
        return {"email": "ms_user@example.com", "full_name": "Microsoft Authenticated User", "oauth_id": f"ms_{code[:10]}", "avatar_url": None}


class GitHubOAuthProvider(IOAuthProvider):
    async def get_authorization_url(self, state: str) -> str:
        return f"https://github.com/login/oauth/authorize?client_id=GITHUB_CLIENT_ID&state={state}"

    async def verify_authorization_code(self, code: str) -> Optional[Dict[str, Any]]:
        logger.info("GitHub OAuth: verifying authorization code")
        return {"email": "github_user@example.com", "full_name": "GitHub Authenticated User", "oauth_id": f"gh_{code[:10]}", "avatar_url": None}
