# RADA CREST — Secure setup

This version uses **Supabase Auth + Postgres + Row Level Security (RLS)**. The browser gets only the publishable/anon key; never put a service_role/secret key in frontend files.

## 1. Create a Supabase project
Open Supabase and create a free project.

## 2. Run the database
Open **SQL Editor**, paste everything from `schema.sql`, and run it.

## 3. Configure Auth
For the easiest first version, enable **Email + Password** in Supabase Authentication.
Set the Site URL and Redirect URLs to your deployed website URL. For local testing, use the URL your local server gives you.

## 4. Add your public project key
Open `config.js` and paste:
- Project URL
- Publishable key (or anon key if your project shows that older name)

Never paste a `service_role` or secret key into the website.

## 5. Create your admin
Do NOT use public Sign Up for admin.
1. Supabase Dashboard → Authentication → Users → Add user.
2. Create your admin email/password.
3. Copy the user's UUID.
4. In SQL Editor run:
   `update public.profiles set role='admin' where id='YOUR-UUID';`

Now:
- Customer: `account.html` → Create Account/Login
- Admin: `admin.html` → Login only

## 6. Deploy for free
Upload the website files to your static host. Keep `config.js` with the public URL + publishable/anon key only.

## Security notes
- RLS is enabled on the exposed tables.
- Customer rows are restricted by `auth.uid()`.
- Admin authorization is checked from a database profile role.
- Admin registration is disabled.
- Do not expose service-role/secret keys.
- For production payments, use a server-side/Edge Function flow so payment secrets never reach the browser.

## Current scope
Authentication, role protection, products, admin dashboard, customer cart and database schema are included.
The next production features are: shipping address/order creation, COD workflow, payment gateway, product image storage, coupon system, and order-status notifications.
