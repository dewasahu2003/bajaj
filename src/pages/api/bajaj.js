
export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // get req
    if (req.method === 'GET') {
        return res.json({ operation_code: 1 });
    }

    // post req
    if (req.method === 'POST') {
        try {
            const { data, file_b64 } = req.body;

            if (!Array.isArray(data)) {
                return res.status(400).json({ 
                    is_success: false,
                    message: "Invalid data format. Expected array."
                });
            }

            
            const numbers = data.filter(item => !isNaN(item));
            const alphabets = data.filter(item => isNaN(item) && item.length === 1);
            
            
            const lowercaseAlphabets = alphabets.filter(char => 
                char >= 'a' && char <= 'z'
            );
            const highest_lowercase_alphabet = lowercaseAlphabets.length > 0 
                ? [lowercaseAlphabets.reduce((a, b) => a > b ? a : b)]
                : [];

            // Check for prime numbers
            const is_prime_found = numbers.some(num => {
                const n = parseInt(num);
                if (n <= 1) return false;
                for (let i = 2; i <= Math.sqrt(n); i++) {
                    if (n % i === 0) return false;
                }
                return true;
            });

            //file if provided
            let fileInfo = {
                file_valid: false,
                file_mime_type: null,
                file_size_kb: null
            };

            if (file_b64) {
                try {
                    const isValidBase64 = /^data:.*?;base64,/.test(file_b64);
                    if (isValidBase64) {
                        const mimeType = file_b64.split(';')[0].split(':')[1];
                        const sizeInKb = Math.round(file_b64.length * 0.75 / 1024);
                        
                        fileInfo = {
                            file_valid: true,
                            file_mime_type: mimeType,
                            file_size_kb: sizeInKb.toString()
                        };
                    }
                } catch (error) {
                    console.error('File processing error:', error);
                }
            }

            const response = {
                is_success: true,
                user_id: "dewa_sahu_28092003", 
                email: "dewasahu2003@gmail.com", 
                roll_number: "0101EC211045", 
                numbers,
                alphabets,
                highest_lowercase_alphabet,
                is_prime_found,
                ...fileInfo
            };

            return res.json(response);
        } catch (error) {
            console.error('Error processing request:', error);
            return res.status(500).json({ 
                is_success: false,
                message: "Internal server error"
            });
        }
    }

    return res.status(405).json({ 
        is_success: false,
        message: "Method not allowed" 
    });
}