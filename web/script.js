
document.getElementById('transactionForm').addEventListener('submit', function(e) {
e.preventDefault();

// Get form data
const formData = new FormData(this);
const data = Object.fromEntries(formData);

// Convert to numbers
const amount = parseFloat(data.amount);
const oldbalanceOrg = parseFloat(data.oldbalanceOrg);
const newbalanceOrig = parseFloat(data.newbalanceOrig);
const oldbalanceDest = parseFloat(data.oldbalanceDest);
const newbalanceDest = parseFloat(data.newbalanceDest);
const step = parseInt(data.step);
const frequency = parseInt(data.frequency);
const type = data.type;

// Simple rule-based prediction logic (simulating ML model)
let riskScore = 0;

// High amount transactions
if (amount > 50000) riskScore += 2;
else if (amount > 10000) riskScore += 1;

// Suspicious balance changes
const expectedNewBalance = oldbalanceOrg - amount;
if (Math.abs(newbalanceOrig - expectedNewBalance) > 1000) riskScore += 2;

// Round number amounts (often suspicious)
if (amount % 1000 === 0 && amount > 5000) riskScore += 1;

// High frequency transactions
if (frequency > 20) riskScore += 2;
else if (frequency > 10) riskScore += 1;

// Suspicious transaction types
if (type === 'CASH_OUT' && amount > 20000) riskScore += 2;
if (type === 'TRANSFER' && amount > 30000) riskScore += 1;

// Zero balances (potential structuring)
if (newbalanceOrig === 0 && amount > 5000) riskScore += 2;

// Odd hours (late night transactions)
if (step % 24 > 22 || step % 24 < 6) riskScore += 1;

// Show result
const resultDiv = document.getElementById('result');
resultDiv.style.display = 'block';

if (riskScore >= 4) {
    resultDiv.className = 'result suspicious';
    resultDiv.innerHTML = `
        <div style="font-size: 1.5rem; margin-bottom: 10px;">⚠️ HIGH RISK TRANSACTION</div>
        <div>This transaction shows multiple suspicious patterns and requires immediate review.</div>
        <div style="margin-top: 15px; font-size: 0.9rem; opacity: 0.9;">Risk Score: ${riskScore}/10</div>
    `;
} else if (riskScore >= 2) {
    resultDiv.className = 'result suspicious';
    resultDiv.innerHTML = `
        <div style="font-size: 1.5rem; margin-bottom: 10px;">🔶 MEDIUM RISK TRANSACTION</div>
        <div>This transaction requires additional monitoring and verification.</div>
        <div style="margin-top: 15px; font-size: 0.9rem; opacity: 0.9;">Risk Score: ${riskScore}/10</div>
    `;
} else {
    resultDiv.className = 'result legitimate';
    resultDiv.innerHTML = `
        <div style="font-size: 1.5rem; margin-bottom: 10px;">✅ LEGITIMATE TRANSACTION</div>
        <div>This transaction appears to follow normal patterns and is likely legitimate.</div>
        <div style="margin-top: 15px; font-size: 0.9rem; opacity: 0.9;">Risk Score: ${riskScore}/10</div>
    `;
}

// Scroll to result
resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Add some interactive feedback to form inputs
document.querySelectorAll('input, select').forEach(input => {
input.addEventListener('focus', function() {
    this.parentElement.style.transform = 'translateY(-2px)';
});

input.addEventListener('blur', function() {
    this.parentElement.style.transform = 'translateY(0)';
});
});
