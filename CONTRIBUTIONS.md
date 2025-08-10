# 🛠 Contributing to a Specific Issue

This guide explains how to contribute to a **specific issue** in an open-source project — from requesting assignment to getting your PR merged.

---

## 1️⃣ Check the Issue and Communicate

1. Navigate to the repository’s **Issues** tab.
2. Open the relevant issue (e.g., `Option Slow Mode`).
3. Read the full description and confirm:

   * It is **not already assigned** to someone else.
   * There is **no open Pull Request (PR)** already solving it.
4. Leave a comment to request assignment:

   ```text
   Hi @maintainer_username,  
   I’d like to work on this issue. Could you please assign it to me?  
   Thanks!
   ```
5. **Wait for confirmation** before starting — this avoids duplicated work.

---

## 2️⃣ Fork the Repository

This creates your own copy of the repo on GitHub:

* Click **Fork** (top right on GitHub repo page).
* Select your account.
* You now have:

```arduino
https://github.com/your_username/project_name
```

---

## 3️⃣ Clone Your Fork Locally

```bash
git clone https://github.com/your_username/project_name.git
cd project_name
```

---

## 4️⃣ Create a New Branch for the Issue

Name it something meaningful:

```bash
git checkout -b feature/slow-mode
```

---

## 5️⃣ Make Your Changes

* Open the project in VSCode.
* Edit the specific file(s) for your change.
* Save and test locally (if applicable).

---

## 6️⃣ Stage & Commit Changes

```bash
git add path/to/changed_file
git commit -m "feat: add custom slow mode setting in options.json"
```

💡 **Commit message tips:**

* Start with `feat:` for features, `fix:` for bug fixes, `docs:` for documentation changes.
* Keep it short but descriptive.

---

## 7️⃣ Push Your Branch to Your Fork

```bash
git push origin feature/slow-mode
```

---

## 8️⃣ Create a Pull Request (PR)

* On GitHub, open your fork.
* Click **Compare & Pull Request**.
* Select:

  * **Base repository** = original project
  * **Base branch** = `main` or `master`
  * **Compare branch** = `feature/slow-mode`
* Write a good PR description:

```markdown
### Summary
Added a custom slow mode setting in `options.json` as per Issue #123.

### Changes
- Added `slowmode` field in `options.json`
- Updated channel settings handler to apply the slow mode

### Testing
Tested locally on Discord bot — verified slow mode updates correctly.

Closes #123
```

* Submit the PR.

---

## 9️⃣ Wait for Review

* Maintainers may ask for changes.
* Update code, commit, and push again — your PR updates automatically.

---

## 🔄 10️⃣ After Merge

Sync your fork with the upstream repo:

```bash
git remote add upstream https://github.com/original_owner/project_name.git
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```
