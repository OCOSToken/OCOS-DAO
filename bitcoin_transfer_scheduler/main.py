import os
import subprocess
from datetime import datetime
import schedule
import time
from Crypto.Cipher import AES
import base64
from dotenv import load_dotenv

# === ENVIRONMENT-BASED PASSWORD LOADING ===
load_dotenv()
aes_password = os.getenv("AES_PASSWORD")  # Şifrəni buradan oxuyur — təhlükəsizdir!

# === SETTINGS ===
wallet_file_encrypted = "Wallet_00047.dat.aes"
wallet_file_decrypted = "Wallet_00047.dat"
btc_address = "1C4H17Ec1DRxSYJUEPB8xhnoWKiPhnrsXp"
btc_amount = "0.047"

# === AES DECRYPT FUNCTION ===
def decrypt_wallet():
    if not aes_password:
        raise Exception("❌ AES_PASSWORD is not set in the environment!")
    with open(wallet_file_encrypted, "rb") as f:
        ciphertext = f.read()
    cipher = AES.new(aes_password.encode('utf-8'), AES.MODE_ECB)
    decrypted = cipher.decrypt(ciphertext)
    with open(wallet_file_decrypted, "wb") as f:
        f.write(decrypted)
    print("[✔] Wallet decrypted successfully.")

# === BITCOIN TRANSFER FUNCTION ===
def send_btc():
    print(f"[⏰ {datetime.utcnow()}] Starting scheduled BTC transfer...")
    decrypt_wallet()
    subprocess.run(["bitcoin-cli", "loadwallet", wallet_file_decrypted])
    subprocess.run(["bitcoin-cli", "sendtoaddress", btc_address, btc_amount])
    print("[🚀] BTC successfully sent!")

# === SCHEDULE TRANSFER TIME ===
schedule_time = "15:00"  # UTC format
schedule.every().day.at(schedule_time).do(send_btc)

# === START SCHEDULER ===
print("[🔁] Scheduler started. Waiting for scheduled time...")
while True:
    schedule.run_pending()
    time.sleep(30)
