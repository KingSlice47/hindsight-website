# Hindsight Online Website

A modern, responsive static website for Hindsight Online (Pty) Ltd, featuring online service payments via PayFast integration.

## Project Structure

```
.
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Custom styles
├── js/
│   └── main.js         # JavaScript functionality
└── README.md          # This file
```

## Features

- Responsive design using Tailwind CSS
- Mobile-friendly navigation
- Online Services section with PayFast integration
- Smooth scrolling and animations
- Modern UI with lime green accents

## PayFast Integration Setup

To enable PayFast payments:

1. Sign up for a PayFast merchant account at [PayFast.co.za](https://www.payfast.co.za)
2. Get your Merchant ID and Merchant Key from your PayFast dashboard
3. Open `js/main.js` and update the PayFast integration function with your credentials:

```javascript
const params = {
    merchant_id: 'YOUR_MERCHANT_ID',
    merchant_key: 'YOUR_MERCHANT_KEY',
    return_url: 'https://www.hindsightonline.co.za/thank-you',
    cancel_url: 'https://www.hindsightonline.co.za/cart',
    notify_url: 'https://www.hindsightonline.co.za/api/payfast-callback',
    // ... other parameters
};
```

4. Update the return_url, cancel_url, and notify_url to match your domain
5. Uncomment the PayFast integration code in the `initializePayFastCheckout` function

## Deployment

1. Upload all files to your cPanel hosting
2. Ensure all files maintain their directory structure
3. Set up SSL certificate for secure payments
4. Test PayFast integration in sandbox mode before going live

## Development

To modify the website:

1. Edit `index.html` for content changes
2. Modify `css/styles.css` for custom styling
3. Update `js/main.js` for functionality changes

## Testing PayFast Integration

1. Use PayFast's sandbox environment for testing
2. Test all payment buttons
3. Verify successful payment flow
4. Check payment notifications
5. Test error scenarios

## Security Notes

- Always use HTTPS for payment pages
- Keep PayFast credentials secure
- Regularly update dependencies
- Monitor transaction logs

## Support

For technical support or questions about the website, contact your web developer.

For PayFast-related queries, contact PayFast support at [support@payfast.co.za](mailto:support@payfast.co.za). 