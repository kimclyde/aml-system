document.getElementById('transactionForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    // Show loading state
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.className = 'result';
    resultDiv.innerHTML = `
        <div style="font-size: 1.5rem; margin-bottom: 10px;">⏳ Analyzing Transaction...</div>
        <div>Please wait while we process your transaction data.</div>
    `;

    try {
        // Prepare data for API using form values
        const transactionData = {
            day_name: data.day_name,
            hour: parseInt(data.hour),
            amount: parseFloat(data.amount),
            pay_curr: data.pay_curr,
            recieved_curr: data.recieved_curr,
            send_loc: data.send_loc,
            recieve_loc: data.recieve_loc,
            payment_type: data.type
        };

        // Make API call
        const response = await fetch('http://localhost:8000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactionData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Display results based on API response
        displayResult(result, data.amount);

    } catch (error) {
        console.error('Error:', error);
        resultDiv.className = 'result suspicious';
        resultDiv.innerHTML = `
            <div style="font-size: 1.5rem; margin-bottom: 10px;">❌ Analysis Failed</div>
            <div>Unable to connect to the analysis service. Please try again later.</div>
            <div style="margin-top: 15px; font-size: 0.9rem; opacity: 0.9;">Error: ${error.message}</div>
        `;
    }

    // Scroll to result
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

function getDayName() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
}

function displayResult(apiResult, amount) {
    const resultDiv = document.getElementById('result');
    const prediction = apiResult.prediction;
    const probability = apiResult.probability;
    
    // probability[0] = legitimate probability, probability[1] = suspicious probability
    const legitimateProbability = (probability[0] * 100).toFixed(1);
    const suspiciousProbability = (probability[1] * 100).toFixed(1);
    
    if (prediction === 1) {
        // Suspicious transaction (prediction = 1)
        resultDiv.className = 'result suspicious';
        resultDiv.innerHTML = `
            <div style="font-size: 1.5rem; margin-bottom: 10px;">⚠️ SUSPICIOUS TRANSACTION DETECTED</div>
            <div>This transaction has been flagged as potentially fraudulent and requires immediate review.</div>
            <div style="margin-top: 15px; font-size: 0.9rem; opacity: 0.9;">
                <strong>Risk Score: ${suspiciousProbability}%</strong><br>
                Legitimate: ${legitimateProbability}% | Suspicious: ${suspiciousProbability}%<br>
                Amount: $${parseFloat(amount).toLocaleString()}
            </div>
        `;
    } else {
        // Legitimate transaction (prediction = 0)
        resultDiv.className = 'result legitimate';
        resultDiv.innerHTML = `
            <div style="font-size: 1.5rem; margin-bottom: 10px;">✅ LEGITIMATE TRANSACTION</div>
            <div>This transaction appears to follow normal patterns and is likely legitimate.</div>
            <div style="margin-top: 15px; font-size: 0.9rem; opacity: 0.9;">
                <strong>Confidence: ${legitimateProbability}%</strong><br>
                Legitimate: ${legitimateProbability}% | Suspicious: ${suspiciousProbability}%<br>
                Amount: $${parseFloat(amount).toLocaleString()}
            </div>
        `;
    }
}

// Add some interactive feedback to form inputs
document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-2px)';
    });

    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateY(0)';
    });
});

// Auto-fill current day and hour for user convenience
document.addEventListener('DOMContentLoaded', function() {
    const currentDay = getDayName();
    const currentHour = new Date().getHours();
    
    document.getElementById('day_name').value = currentDay;
    document.getElementById('hour').value = currentHour;
});
