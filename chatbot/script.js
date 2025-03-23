document.addEventListener('DOMContentLoaded', () => {
  particlesJS('particles-js', {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        }
      },
      "opacity": {
        "value": 0.5,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 4,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": false,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 2,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": false,
          "mode": "repulse"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      }
    },
    "retina_detect": true
  });

  fetch('script.json')
    .then(response => response.json())
    .then(data => {
      const apiKey = data.API_KEY;
      const typingForm = document.querySelector(".typing-form");
      const chatContainer = document.querySelector(".chat-list");
      const sendMessageButton = document.querySelector(".send-button");

      function createMessageElement(content, classes) {
        const div = document.createElement("div");
        div.classList.add("message", ...classes);
        div.innerHTML = content;
        return div;
      }

      function generateAPIResponse(message, callback) {
        fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            contents: [{ 
              role: "user", 
              parts: [{ text: message }] 
            }] 
          }),
        })
        .then(response => response.json())
        .then(data => {
          const apiResponse = data.candidates[0].content.parts[0].text;
          callback(apiResponse);
        })
        .catch(error => console.error('Error:', error));
      }

      function handleOutgoingChat() {
        const userMessage = typingForm.querySelector(".typing-input").value.trim();
        if (!userMessage) return;
        
        const userMessageDiv = createMessageElement(`<p>${userMessage}</p>`, ["outgoing"]);
        chatContainer.appendChild(userMessageDiv);
        
        typingForm.reset();
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        generateAPIResponse(userMessage, (response) => {
          const botMessageDiv = createMessageElement(`<p>${response}</p>`, ["incoming"]);
          chatContainer.appendChild(botMessageDiv);
          chatContainer.scrollTop = chatContainer.scrollHeight;
        });
      }

      typingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleOutgoingChat();
      });
    })
    .catch(error => console.error('Error loading API key:', error));
});