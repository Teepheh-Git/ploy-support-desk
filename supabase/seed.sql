-- Ploy Support Desk: demo data for presentations.
-- Run after supabase/schema.sql in Supabase → SQL Editor → New query → Run.
-- Safe to run more than once: existing ticket numbers are skipped.

insert into public.tickets (ticket_number, customer_name, customer_email, customer_phone, subject, description, category, priority, status, source, created_at, updated_at) values
  ('TKT-000001', 'Amina Yusuf', 'amina@example.com', '+234 801 000 0001', 'WhatsApp disconnected after phone restart', 'Customer says the WhatsApp connection drops every time the phone restarts and needs a new QR scan.', 'WhatsApp Connection', 'High', 'In Progress', 'WhatsApp', now() - interval '6 days', now() - interval '1 day'),
  ('TKT-000002', 'Tunde Bello', 'tunde@example.com', '+234 802 000 0002', 'Cannot log in to dashboard', 'Password reset email never arrives. Customer has tried three times.', 'Account Access', 'High', 'Open', 'Email', now() - interval '5 days', now() - interval '5 days'),
  ('TKT-000003', 'Chioma Eze', 'chioma@example.com', '+234 803 000 0003', 'Double charge on monthly plan', 'Card was charged twice for the October subscription. Please refund the duplicate.', 'Billing and Payments', 'High', 'Open', 'Phone Call', now() - interval '4 days', now() - interval '4 days'),
  ('TKT-000004', 'Kunle Adeyemi', 'kunle@example.com', '', 'Invoice shows the wrong VAT rate', 'The invoice for September used 5% VAT instead of 7.5%.', 'Invoicing', 'Medium', 'Resolved', 'Email', now() - interval '9 days', now() - interval '2 days'),
  ('TKT-000005', 'Ngozi Okafor', 'ngozi@example.com', '+234 805 000 0005', 'App crashes on upload', 'The app closes whenever a customer tries to upload a photo larger than 5 MB.', 'Technical Issues', 'Medium', 'In Progress', 'WhatsApp', now() - interval '3 days', now() - interval '3 hours'),
  ('TKT-000006', 'Samuel Obi', 'samuel@example.com', '+234 806 000 0006', 'How do I add a team member?', 'Asking how to give a colleague access to the account.', 'General Enquiries', 'Low', 'Resolved', 'Other', now() - interval '8 days', now() - interval '7 days'),
  ('TKT-000007', 'Fatima Ibrahim', 'fatima@example.com', '+234 807 000 0007', 'Messages delayed by several hours', 'Outgoing WhatsApp messages arrive hours late during the evening.', 'WhatsApp Connection', 'Medium', 'Open', 'WhatsApp', now() - interval '2 days', now() - interval '2 days'),
  ('TKT-000008', 'David Mensah', 'david@example.com', '+233 20 000 0008', 'Refund not showing on card', 'Refund was approved last week but the customer still cannot see it on their statement.', 'Billing and Payments', 'Medium', 'In Progress', 'Email', now() - interval '1 day', now() - interval '12 hours'),
  ('TKT-000009', 'Grace Nwosu', 'grace@example.com', '', 'Two-factor code not received', 'SMS verification code never arrives on a Lagos number.', 'Account Access', 'High', 'Open', 'Phone Call', now() - interval '6 hours', now() - interval '6 hours'),
  ('TKT-000010', 'Ibrahim Musa', 'ibrahim@example.com', '+234 810 000 0010', 'Request for bulk invoice export', 'Would like all invoices from the last quarter exported as one file.', 'Invoicing', 'Low', 'Open', 'Other', now() - interval '20 minutes', now() - interval '20 minutes')
on conflict (ticket_number) do nothing;

-- A few activity notes so the history on the details page is not empty.
insert into public.ticket_updates (ticket_id, message, old_status, new_status, created_at)
select t.id, 'Asked the customer to update the WhatsApp app and reconnect.', null, null, now() - interval '5 days'
from public.tickets t where t.ticket_number = 'TKT-000001'
  and not exists (select 1 from public.ticket_updates u where u.ticket_id = t.id);

insert into public.ticket_updates (ticket_id, message, old_status, new_status, created_at)
select t.id, 'Escalated to the engineering team for a connection fix.', 'Open', 'In Progress', now() - interval '1 day'
from public.tickets t where t.ticket_number = 'TKT-000001'
  and not exists (select 1 from public.ticket_updates u where u.ticket_id = t.id and u.new_status = 'In Progress');

insert into public.ticket_updates (ticket_id, message, old_status, new_status, created_at)
select t.id, 'Confirmed the VAT correction and issued a new invoice.', 'In Progress', 'Resolved', now() - interval '2 days'
from public.tickets t where t.ticket_number = 'TKT-000004'
  and not exists (select 1 from public.ticket_updates u where u.ticket_id = t.id);
