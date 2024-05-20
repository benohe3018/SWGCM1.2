import hashlib

def generate_sha256_hash(text):
    # Codifica el texto en UTF-8
    utf8_text = text.encode('utf-8')
    
    # Genera el hash SHA-256
    sha256_hash = hashlib.sha256(utf8_text).hexdigest('HalaMadrid3018?')
    print (sha256_hash)
    
    return sha256_hash
        
   