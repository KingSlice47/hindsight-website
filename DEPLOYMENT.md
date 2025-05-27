# Deployment Guide for Hindsight Online Website

## Preparing Files for Upload

1. Create a ZIP file containing all website files:
   - index.html
   - about.html
   - services.html
   - contact.html
   - css/styles.css
   - js/main.js
   - images/ (folder with all images)

## cPanel Deployment Steps

1. **Login to cPanel**
   - Go to domains.co.za hosting control panel
   - Login with your credentials
   - Access cPanel

2. **Upload Files**
   - In cPanel, find and click "File Manager"
   - Navigate to `public_html` directory
   - Click "Upload" and select your website ZIP file
   - Extract the ZIP file in `public_html`

3. **File Permissions**
   - Select all files and folders
   - Click "Permissions" (or right-click → Change Permissions)
   - Set permissions:
     - Files: 644
     - Folders: 755
   - Apply recursively

4. **Domain Configuration**
   - In cPanel, go to "Domains" section
   - Ensure www.hindsightonline.co.za points to public_html directory
   - Set up SSL certificate if not already configured

5. **SSL Certificate Setup**
   - In cPanel, find "SSL/TLS" or "Security"
   - Click "Install SSL Certificate"
   - Choose "Let's Encrypt" for free SSL
   - Follow the installation wizard
   - Enable "Force HTTPS" redirection

6. **Testing**
   - Visit www.hindsightonline.co.za
   - Test all pages and forms
   - Verify SSL is working (look for padlock icon)
   - Test on multiple devices and browsers

## Post-Deployment Checklist

1. **Verify All Pages**
   - Check all links work
   - Confirm images load properly
   - Test contact form submission
   - Verify PayFast integration

2. **Performance Checks**
   - Test loading speed
   - Verify mobile responsiveness
   - Check browser compatibility

3. **SEO & Analytics**
   - Set up Google Analytics
   - Verify meta tags are correct
   - Submit sitemap to Google Search Console

## Maintenance

1. **Regular Backups**
   - In cPanel, go to "Backup"
   - Create full backup
   - Download and store securely
   - Set up automated backups

2. **Updates**
   - Regularly check and update SSL certificates
   - Monitor disk space usage
   - Update content as needed

## Troubleshooting

Common issues and solutions:

1. **500 Internal Server Error**
   - Check file permissions
   - Verify .htaccess configuration
   - Review error logs in cPanel

2. **Images Not Loading**
   - Verify image paths are correct
   - Check file permissions
   - Confirm image files uploaded properly

3. **Form Not Working**
   - Verify PHP is enabled
   - Check form permissions
   - Review error logs

## Support Contacts

- Domains.co.za Support: [support contact]
- Web Developer: [your contact]
- PayFast Support: support@payfast.co.za

## Important Notes

- Keep cPanel login credentials secure
- Maintain regular backups
- Monitor website uptime
- Keep domain registration and hosting renewed
- Update SSL certificates before expiry 