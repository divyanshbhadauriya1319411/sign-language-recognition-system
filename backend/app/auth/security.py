from passlib.context import CryptContext
import bcrypt
import passlib.handlers.bcrypt

# Compatibility patch for passlib with bcrypt 4.0+
if not hasattr(bcrypt, "__about__"):
    class About:
        __version__ = getattr(bcrypt, "__version__", "4.0.0")
    bcrypt.__about__ = About()

passlib.handlers.bcrypt.detect_wrap_bug = lambda *args, **kwargs: False

_orig_calc_checksum = passlib.handlers.bcrypt._BcryptBackend._calc_checksum
def _patched_calc_checksum(self, secret):
    if isinstance(secret, bytes) and len(secret) > 72:
        secret = secret[:72]
    return _orig_calc_checksum(self, secret)
passlib.handlers.bcrypt._BcryptBackend._calc_checksum = _patched_calc_checksum

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")



def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

__all__ = ["pwd_context", "verify_password", "get_password_hash"]
