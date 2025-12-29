document.addEventListener('DOMContentLoaded', function() {
    const inputBubble = document.getElementById('inputBubble');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const uploadBtn = document.querySelector('.upload-btn');
    const audioUpload = document.getElementById('audioUpload');
    const fileNameDisplay = document.getElementById('fileName');
    const emotionDisplay = document.getElementById('emotionDisplay');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const sliderThumb = document.getElementById('sliderThumb');
    
    let selectedFile = null;
    
    // Emotion data in the specified order with positivity values (0-100%)
    const emotions = [
        { name: 'Sad', icon: 'fa-sad-tear', color: 'sad', positivity: 0 },
        { name: 'Angry', icon: 'fa-angry', color: 'angry', positivity: 10 },
        { name: 'Disgust', icon: 'fa-grimace', color: 'disgust', positivity: 20 },
        { name: 'Fearful', icon: 'fa-flushed', color: 'fearful', positivity: 30 },
        { name: 'Neutral', icon: 'fa-meh-blank', color: 'neutral', positivity: 50 },
        { name: 'Calm', icon: 'fa-meh', color: 'calm', positivity: 65 },
        { name: 'Surprised', icon: 'fa-surprise', color: 'surprised', positivity: 80 },
        { name: 'Happy', icon: 'fa-smile', color: 'happy', positivity: 100 }
    ];

    
    // Upload button functionality
    uploadBtn.addEventListener('click', function() {
        audioUpload.click();
    });
    
    audioUpload.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            selectedFile = e.target.files[0];
            fileNameDisplay.textContent = `Selected: ${selectedFile.name}`;
            fileNameDisplay.style.color = '#4cd964';
            analyzeBtn.disabled = false;
        }
    });
    
    // Analyze button functionality
    analyzeBtn.addEventListener('click', function() {
        if (!selectedFile) {
            alert("Please select an audio file first.");
            return;
        }
        
        // Show loading state
        emotionDisplay.classList.add('hidden');
        loadingIndicator.classList.remove('hidden');
        analyzeBtn.disabled = true;
        
        //fetch API
        const formData = new FormData();
        formData.append("audio", selectedFile);

        fetch("/predict", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            const emotion = data.prediction;
            if (!emotion) {
                alert("No emotion returned from server.");
                return;
            }
            const emotionData = emotions.find(e => e.name.toLowerCase() === emotion.toLowerCase());

            if (emotionData) {
                const emotionIcon = document.querySelector('.emotion-icon');
                const emotionText = document.querySelector('.emotion-text');

                emotionIcon.className = `fas ${emotionData.icon} emotion-icon ${emotionData.color}`;
                emotionText.textContent = emotionData.name;
                emotionText.className = `emotion-text ${emotionData.color}`;
                sliderThumb.style.left = `${emotionData.positivity}%`;
            } else {
                alert("Received unknown emotion: " + emotion);
            }

            loadingIndicator.classList.add('hidden');
            emotionDisplay.classList.remove('hidden');
            analyzeBtn.disabled = false;
        })
        .catch(error => {
            alert("Error: " + error.message);
            loadingIndicator.classList.add('hidden');
            analyzeBtn.disabled = false;
        });
                
        console.log("API response:", data);
        console.log("Predicted emotion:", emotion);

    });
    
    // Initialize slider at neutral position (50%)
    sliderThumb.style.left = '50%';
});


