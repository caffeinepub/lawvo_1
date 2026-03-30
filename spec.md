# Vakyom

## Current State
The app has a VoiceAssistant screen (Talk to Vakyom) with basic speech recognition and TTS. The AdminScreen has tabs for Users, Lawyers, Feedback, Cases, and Login History. The backend stores users, lawyers, cases, feedback, and login records.

## Requested Changes (Diff)

### Add
- `ChatbotEntry` type in backend: stores id, keyword (topic key), title, keywords array (for matching), answer fields (whatToDo, documents, lawyerType, cost, time, successRate, tip), icon
- `getChatbotEntries()` query -- returns all 10 entries
- `updateChatbotEntry()` shared -- admin can update any entry by id
- `resetChatbotEntries()` shared -- resets to defaults
- VoiceAssistant screen rebuilt as a rule-based chatbot with 10 legal topics (land dispute, FIR, bail, divorce, domestic violence, salary unpaid, cheque bounce, consumer complaint, cyber fraud, builder/RERA, fundamental rights)
- Each answer displays as a structured card: whatToDo, documents, lawyerType, cost, time, successRate, tip + disclaimer
- Voice input via mic tap (speech recognition in selected language)
- Voice output via Google Translate TTS with 🔊 Hear button
- Disclaimer on every answer in selected language: "This is legal guidance, not legal advice. Please consult a qualified lawyer for your specific situation."
- AdminScreen: new "Chatbot" tab listing all 10 Q&A entries with Edit button for each, opening an edit modal to modify the answer fields

### Modify
- VoiceAssistant.tsx: replace existing screen with new rule-based chatbot UI
- AdminScreen.tsx: add Chatbot tab

### Remove
- Nothing removed from existing screens

## Implementation Plan
1. Add ChatbotEntry type + CRUD functions to backend (main.mo)
2. Regenerate backend bindings
3. Rebuild VoiceAssistant.tsx with keyword matching, structured card display, TTS voice output
4. Add Chatbot tab to AdminScreen.tsx with edit modal
5. Validate and deploy
