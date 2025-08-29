BioreCyclio Static Site

Files:
- index.html
- assets/Biorecyclio-business-plan.pdf

Quick deploy on GoDaddy (Linux Hosting w/ cPanel):
1) Log in to GoDaddy > My Products > Web Hosting > cPanel Admin.
2) Open File Manager > public_html (or the folder mapped to biorecyclio.com).
3) Upload biorecyclio-site.zip and click "Extract". Ensure index.html sits directly in public_html.
4) (Optional) Create hello@biorecyclio.com under cPanel > Email Accounts and update the email in index.html if needed.
5) Force HTTPS: In cPanel, enable SSL (AutoSSL/Let's Encrypt) and, if desired, add a simple .htaccess redirect.
6) Visit https://biorecyclio.com to test.

Alternative (Netlify/GitHub Pages + GoDaddy DNS):
1) Host this folder on Netlify or GitHub Pages.
2) In GoDaddy DNS, set the A/ALIAS or CNAME records for biorecyclio.com and www to your hosting provider’s values.
3) Add a custom domain on the hosting platform and issue an SSL certificate.

Edit the site:
- All content is in index.html (Tailwind via CDN).
- Replace the contact email (hello@biorecyclio.com) with your live address.
- Replace or expand sections as your product matures.

— Generated 2025-08-29 22:14