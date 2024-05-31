const stripe = require('stripe')('sk_test_51L6mcmC20WScuPoYCwxlyfpI9FZRBIGmbDXgwQVkgAxDX4jaqB5DjMINJkNOzI8lok4BSQZQsjE6CvNZg4yys0gZ00QvfaoWbp');
// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

const account = await stripe.accounts.create({ type: 'express' });

const accountLink = await stripe.accountLinks.create({
    account: 'acct_1032D82eZvKYlo2C',
    refresh_url: 'https://example.com/reauth',
    return_url: 'https://example.com/return',
    type: 'account_onboarding',
});

app.post('/payment-sheet', async (req, res) => {
    // Use an existing Customer ID if this is a returning customer.
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: '2020-08-27' }
    );
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1099,
        currency: 'eur',
        customer: customer.id,
        automatic_payment_methods: {
            enabled: true,
        },
        application_fee_amount: 123,
        transfer_data: {
            destination: '{{CONNECTED_ACCOUNT_ID}}',
        },
    });

    res.json({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey: 'pk_test_51L6mcmC20WScuPoYPlQt3SQTOeRTurBaihA5vxtNMcCLX8QMu4FfqzlfRSkBnl1q6SCtfirIDsCRfsiWrgQ5NZw400z6WCymr4'
    });
});