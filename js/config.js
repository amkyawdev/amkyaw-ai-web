// Configuration - CSV paths and keywords for intent routing

export const config = {
    // CSV file paths (relative to index.html)
    csvPath: 'data/chat/',
    
    // Keyword to CSV mapping
    intents: {
        // Coding related
        coder: {
            csv: 'coder.csv',
            keywords: ['code', 'python', 'javascript', 'java', 'programming', 'coding', 'developer', 'react', 'css', 'html', 'node', 'js', 'ပြင်းအဝေး', 'ပရိုဂရမ်', 'ကုဒ်']
        },
        // Website related
        website: {
            csv: 'website.csv',
            keywords: ['website', 'web', 'frontend', 'backend', 'fullstack', 'design', 'ui', 'ux', 'web development', 'ဝက်ဘ်ဆိုက်', 'ဝက်ဘ်']
        },
        // Contact related
        contact: {
            csv: 'contact.csv',
            keywords: ['contact', 'email', 'facebook', 'messenger', 'phone', 'address', 'ဆက်သွယ်', 'ဖုန်း', 'အီးမေးလ်']
        },
        // General chat (default)
        chat: {
            csv: 'chat.csv',
            keywords: ['hello', 'hi', 'hey', 'မင်္ဂလာပါ', 'ဟိုင်း', 'နေကောင်းလား', 'အားရှိသလား']
        }
    },
    
    // Fallback CSV file
    fallbackCsv: 'fallback.csv'
};