// ===== COMMON FUNCTIONALITY FOR ALL PAGES =====

// ===== CHATBOT FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotBack = document.getElementById('chatbotBack');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const attachBtn = document.getElementById('attachBtn');
    const fileInput = document.getElementById('fileInput');
    
    if (!chatbotToggle) return;
    
    // Toggle chatbot
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    });
    
    // Close chatbot
    const closeChat = () => {
        chatbotWindow.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    };
    
    if (chatbotClose) chatbotClose.addEventListener('click', closeChat);
    if (chatbotBack) chatbotBack.addEventListener('click', closeChat);
    
    // File attachment
    if (attachBtn && fileInput) {
        attachBtn.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Show file upload message
                const fileMsg = document.createElement('div');
                fileMsg.className = 'chatbot-message user';
                fileMsg.innerHTML = `📎 Uploaded: ${file.name}`;
                chatbotMessages.appendChild(fileMsg);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                
                // Bot response
                setTimeout(() => {
                    const botMsg = document.createElement('div');
                    botMsg.className = 'chatbot-message bot';
                    botMsg.textContent = 'Thank you for sharing the file! Our team will review it and get back to you shortly. Is there anything specific you\'d like us to know about this file?';
                    chatbotMessages.appendChild(botMsg);
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                }, 500);
                
                fileInput.value = ''; // Reset input
            }
        });
    }
    
    // Quick options
    document.querySelectorAll('.quick-option').forEach(option => {
        option.addEventListener('click', () => {
            const message = option.dataset.msg;
            sendMessage(message);
        });
    });
    
    // Sidebar buttons
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action) {
                sendMessage(action);
            }
        });
    });
    
    // Send message
    function sendMessage(text = null) {
        const message = text || chatbotInput.value.trim();
        if (!message) return;
        
        // Remove quick options after first message
        const quickOptions = chatbotMessages.querySelector('.quick-options');
        if (quickOptions) {
            quickOptions.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => quickOptions.remove(), 300);
        }
        
        // Add user message with animation
        const userMsg = document.createElement('div');
        userMsg.className = 'chatbot-message user';
        userMsg.textContent = message;
        userMsg.style.opacity = '0';
        chatbotMessages.appendChild(userMsg);
        
        // Animate user message
        setTimeout(() => {
            userMsg.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            userMsg.style.opacity = '1';
        }, 10);
        
        chatbotInput.value = '';
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        chatbotMessages.appendChild(typingIndicator);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        // Bot response after delay
        setTimeout(() => {
            typingIndicator.remove();
            
            const botMsg = document.createElement('div');
            botMsg.className = 'chatbot-message bot';
            botMsg.textContent = getBotResponse(message);
            botMsg.style.opacity = '0';
            chatbotMessages.appendChild(botMsg);
            
            // Animate bot message
            setTimeout(() => {
                botMsg.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                botMsg.style.opacity = '1';
            }, 10);
            
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 1500);
    }
    
    // Bot responses
    function getBotResponse(message) {
        const msg = message.toLowerCase();
        
        if (msg.includes('course') || msg.includes('class')) {
            return 'We offer courses for grades 5th to 12th in all subjects including Math, Science, English, and more. Visit our Courses page for details!';
        } else if (msg.includes('fee') || msg.includes('price') || msg.includes('cost')) {
            return 'Our fee structure varies by grade and course. Please contact us at +91 9024401590 or visit our Contact page for detailed information.';
        } else if (msg.includes('enroll') || msg.includes('admission') || msg.includes('join')) {
            return 'You can enroll by clicking the "Book Now" button or visiting our Booking page. You can also call us at +91 9024401590.';
        } else if (msg.includes('contact') || msg.includes('phone') || msg.includes('address')) {
            return 'Contact us at +91 9024401590 or visit our Contact page for our address and other details. We are located in Jaipur, Rajasthan.';
        } else if (msg.includes('time') || msg.includes('schedule') || msg.includes('timing')) {
            return 'Our classes run from 6 AM to 9 PM with flexible batch timings. Contact us to find a schedule that works for you!';
        } else if (msg.includes('result') || msg.includes('success')) {
            return 'We have a 95% success rate in board examinations! Check our Results page to see our students\' achievements.';
        } else if (msg.includes('teacher') || msg.includes('faculty')) {
            return 'Our teachers are highly qualified with 10+ years of experience. Visit our Gallery page to meet them!';
        } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
            return 'Hello! How can I assist you today? Feel free to ask about courses, fees, enrollment, or anything else!';
        } else if (msg.includes('thank')) {
            return 'You\'re welcome! Feel free to ask if you have any other questions. 😊';
        } else if (msg.includes('gallery') || msg.includes('photo') || msg.includes('picture')) {
            return 'Check out our Gallery page to see our beautiful campus, modern facilities, and meet our expert teachers!';
        } else {
            return 'Thank you for your question! For detailed information, please call us at +91 9024401590 or visit our Contact page. Our team will be happy to help!';
        }
    }
    
    if (chatbotSend) {
        chatbotSend.addEventListener('click', () => sendMessage());
    }
    
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
});
