# TODO: Add Testimonial Section to Home Page

## Steps to Complete

- [x] Create "Testimonials" table in Supabase with SQL:
  ```sql
  CREATE TABLE Testimonials (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  ```

- [x] Create ManageTestimonials.jsx component for CRUD operations on testimonials.

- [x] Create ManageTestimonials.css for styling the ManageTestimonials component.

- [x] Add "Testimonials" nav item in AdminDashboard.jsx sidebar.

- [x] Create Testimonials.jsx component to fetch and display active testimonials on the home page.

- [x] Create Testimonials.css for styling the Testimonials display component.

- [x] Add Testimonials component to the home page route in App.jsx (after Products, before Footer).

- [x] Remove announcements feature completely.

- [ ] Test the admin management and home page display.

- [ ] Ensure responsive design and error handling.
