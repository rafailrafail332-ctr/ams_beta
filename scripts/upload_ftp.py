import ftplib
import os
import glob
import time

FTP_HOST = "103.163.161.124"
FTP_USER = "amsprope"
FTP_PASS = "X9182Ynrh+;XEv"

def deploy():
    print(f"Connecting to {FTP_HOST}...")
    ftp = ftplib.FTP()
    ftp.connect(FTP_HOST, 21, timeout=60)
    ftp.login(FTP_USER, FTP_PASS)
    ftp.set_pasv(True)

    dist_assets = r"C:\laragon\www\ams\dist\assets"

    # 1. Upload CSS & Images
    ftp.cwd("public_html/assets")
    for f in os.listdir(dist_assets):
        local_f = os.path.join(dist_assets, f)
        if os.path.isfile(local_f) and not f.endswith(".js"):
            print(f"Uploading asset: {f}...")
            try:
                ftp.delete(f)
            except:
                pass
            with open(local_f, "rb") as fh:
                ftp.storbinary(f"STOR {f}", fh, blocksize=8192)

    # 2. Upload JS
    for f in os.listdir(dist_assets):
        local_f = os.path.join(dist_assets, f)
        if os.path.isfile(local_f) and f.endswith(".js"):
            print(f"Uploading JS bundle: {f} ({os.path.getsize(local_f)} bytes)...")
            try:
                ftp.delete(f)
            except:
                pass
            with open(local_f, "rb") as fh:
                ftp.storbinary(f"STOR {f}", fh, blocksize=8192)
            print(f"Verified remote size: {ftp.size(f)}")

    # 3. Upload index.html
    ftp.cwd("..")
    html_path = r"C:\laragon\www\ams\dist\index.html"
    print("Uploading index.html...")
    with open(html_path, "rb") as fh:
        ftp.storbinary("STOR index.html", fh)

    ftp.quit()
    print("\n>>> ALL FILES DEPLOYED TO PRODUCTION SUCCESSFULLY! <<<")

if __name__ == "__main__":
    deploy()
