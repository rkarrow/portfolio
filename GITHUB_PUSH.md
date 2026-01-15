# Push to GitHub - Authentication Guide

Your code is committed and ready to push! You just need to authenticate with GitHub.

## Option 1: Personal Access Token (Easiest)

### Step 1: Create a Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `Portfolio Push`
4. Select expiration (30 days, 90 days, or no expiration)
5. Check the **`repo`** scope (full control of private repositories)
6. Click **"Generate token"**
7. **COPY THE TOKEN** (you won't see it again!)

### Step 2: Push Your Code
Run this command in your terminal:
```bash
cd /Users/smartasia/Desktop/portfo
git push -u origin master
```

When prompted:
- **Username**: Enter your GitHub username (`rkarrow`)
- **Password**: Paste the token you just copied (NOT your GitHub password)

---

## Option 2: Use SSH (More Secure)

### Step 1: Check if you have SSH keys
```bash
ls -al ~/.ssh
```

### Step 2: If you don't have SSH keys, generate them
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter to accept default file location
# Press Enter twice for no passphrase (or set one)
```

### Step 3: Add SSH key to GitHub
```bash
# Copy your public key
cat ~/.ssh/id_ed25519.pub
# Copy the output
```

Then:
1. Go to: https://github.com/settings/keys
2. Click **"New SSH key"**
3. Paste your public key
4. Click **"Add SSH key"**

### Step 4: Change remote to SSH
```bash
cd /Users/smartasia/Desktop/portfo
git remote set-url origin git@github.com:rkarrow/portfolio.git
git push -u origin master
```

---

## Option 3: Use GitHub Desktop
1. Download GitHub Desktop: https://desktop.github.com
2. Sign in with your GitHub account
3. Add your repository
4. Click "Push origin"

---

## Quick Command Reference

After authenticating, you can push with:
```bash
git push origin master
```

Or if you want to push to `main` branch instead:
```bash
git branch -M main
git push -u origin main
```

---

## Troubleshooting

**"Authentication failed"**
- Make sure you're using a Personal Access Token, not your password
- Check that the token has `repo` scope

**"Permission denied"**
- Verify you have write access to the repository
- Check that the repository exists at https://github.com/rkarrow/portfolio

**"Repository not found"**
- Make sure the repository exists on GitHub
- Create it at: https://github.com/new (name it `portfolio`)
