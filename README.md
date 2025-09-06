# Vikash Chatbot

A modern, privacy‑friendly React chatbot UI with pluggable AI providers (Gemini / OpenAI / custom HTTP). Built for speed, clean UX, and easy deployment on Netlify/Vercel.

> **Language:** 🇮🇳 Hindi‑first (bilingual docs) · **Framework:** React · **Styling:** Tailwind CSS · **State:** Hooks · **Build:** Vite

---

## ✨ Highlights / फ़ीचर्स

- 🎯 **Clean UI** – Mobile + Desktop responsive layout, auto‑scroll, message grouping, typing indicator.
- 🧠 **Pluggable Models** – Gemini / OpenAI / any custom REST endpoint via a single adapter.
- 🔒 **Key Handling** – API Key via `.env` (no key in client bundle if proxied via server).
- 💾 **Chat Persistence** – LocalStorage में पुरानी chat सेव रहती है (clear/reset button भी)।
- 🖼️ **Theme/Background** – Optional background image + light/dark modes.
- 🧩 **Profile Instructions** – `profile.txt` से system prompt/ persona लोड करें।
- 📝 **Markdown Support** – Code blocks, links, and basic formatting.

---

## 📸 Screenshots

> Replace with your images under `public/` and update paths.

| Home | Mobile |
| ---- | ------ |
|      |        |

---

## 🧱 Tech Stack

- **React** + **Vite**
- **Tailwind CSS**
- (Optional) **Express/Cloudflare Worker** for server‑side API proxy

---

## 📂 Folder Structure

```
├─ public/
│  ├─ profile.txt
│  └─ screenshots/
├─ src/
│  ├─ adapters/
│  │  ├─ geminiAdapter.js
│  │  ├─ openaiAdapter.js
│  │  └─ customAdapter.js
│  ├─ components/
│  │  ├─ ChatBot.jsx
│  │  ├─ Message.jsx
│  │  └─ TypingDots.jsx
│  ├─ hooks/
│  │  └─ useLocalStorage.js
│  ├─ styles/
│  │  └─ index.css
│  └─ main.jsx
├─ .env.example
├─ index.html
├─ package.json
└─ README.md
```

---

## 🚀 Quick Start (Local)

```bash
# 1) Clone
git clone https://github.com/your-username/vikash-chatbot.git
cd vikash-chatbot

# 2) Install deps
npm install

# 3) Setup env
cp .env.example .env
# Edit .env and add your keys

# 4) Run
npm run dev
```

### `.env.example`

```
# choose one provider at a time
VITE_PROVIDER=gemini   # gemini | openai | custom

# Gemini (client-side fetch to Google API)
VITE_GEMINI_API_KEY=your_key_here
VITE_GEMINI_MODEL=gemini-1.5-flash-latest

# OpenAI
VITE_OPENAI_API_KEY=your_key_here
VITE_OPENAI_MODEL=gpt-4o-mini

# Custom REST (your proxy)
VITE_CUSTOM_ENDPOINT=https://your-proxy.example.com/chat
```

> **Security Note:** Production में API keys को client पर **expose ना करें**. एक छोटा server proxy (Express/Cloudflare Worker) use करें और client से उसी को hit करें।

---

## 🔌 Switching Providers (Adapter Pattern)

`src/adapters/` में हर provider का एक function होता है जो input → output text लौटाता है.

**Example: **``

```js
export async function chatWithGemini(messages, apiKey, model) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: messages.map(m => ({role: m.role, parts:[{text: m.content}] })) })
    }
  );
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}
```

**Example: **``

```js
export async function chatWithOpenAI(messages, apiKey, model) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({ model, messages })
  });
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || '';
}
```

**Example: **``

```js
export async function chatWithCustom(messages, endpoint) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });
  const data = await res.json();
  return data.reply || data.output || '';
}
```

`ChatBot.jsx` में `VITE_PROVIDER` के आधार पर adapter चुनें।

---

## 🧑‍💻 Usage

- UI में नीचे input में message लिखें और **Enter** दबाएं।
- Left top मेनू से **Model** बदलें (Gemini/OpenAI/Custom).
- **Clear Chat** से local history हटाएं।
- `public/profile.txt` edit करके bot की persona बदलें।

---

## 🛡️ Error Handling

- **No response / timeouts**: नेटवर्क मुद्दा या quota limit. Console देखें.
- **429/Quota**: Provider dashboard में quota चेक करें.
- **CORS**: Client → Provider direct call पर CORS आ सकता है; proxy server use करें.

---

## 🏗️ Deploy

### Netlify / Vercel (Static Frontend)

1. Repo connect करें
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment Variables (डैशबोर्ड पर सेट करें)

### Server Proxy (Optional)

- `/server` folder में Express/Worker example जोड़ें (reverse‑proxy your API).

---

## 🤝 Contributing

PRs welcome! Please open an issue for feature requests/bugs.

---

## 🗺️ Roadmap

-

---

## ❓ FAQ

**Q: Message ek hi paragraph me aa raha hai?**\
A: Markdown enable है. Newline के लिए दो spaces + Enter या `\n\n` भेजें; rendering component में `white-space: pre-wrap;` रखें.

**Q: "No response from Gemini" क्यों?**\
A: Key invalid, quota over, या CORS. DevTools में network tab चेक करें; server proxy try करें.

**Q: Gemini से ChatGPT (OpenAI) पर कैसे switch करें?**\
A: `.env` में `VITE_PROVIDER=openai`, key/model भरें, restart dev server.

---

## 📜 License

MIT – use it freely for personal & commercial projects.

---

## 🧾 Badges (Optional)

```
![Made with React](https://img.shields.io/badge/React-18-blue)
![Tailwind](https://img.shields.io/badge/TailwindCSS-v3-38bdf8)
![Vite](https://img.shields.io/badge/Vite-fast-purple)
![License: MIT](https://img.shields.io/badge/License-MIT-green)
```

---

## 🙌 Credits

Built by Vikash with guidance from AI assistant.

