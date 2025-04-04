export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* About Section + Social Media */}
        <div>
          <h3 className="text-2xl font-bold mb-4 text-gradient">
            M R Consultants
          </h3>
          <p className="text-gray-400">
            We are a leading firm in real estate, construction, land
            development, and home interior design—delivering futuristic
            solutions that redefine innovation.
          </p>

          {/* Social Media Links */}
          <div className="mt-4 flex space-x-4">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neonBlue transition"
              aria-label="Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 12c0-5.523-4.477-10-10-10s-10 4.477-10 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54v-2.891h2.54v-2.205c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.464h-1.261c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.891h-2.33v6.987c4.781-.75 8.438-4.887 8.438-9.878z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neonBlue transition"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7.75 2h8.5C18.99 2 22 5.01 22 8.75v6.5C22 18.99 18.99 22 16.25 22h-8.5C5.01 22 2 18.99 2 16.25v-6.5C2 5.01 5.01 2 7.75 2zm4.25 5.25a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5zm0 1.5a3.75 3.75 0 110 7.5 3.75 3.75 0 010-7.5zm6.25-.5a1 1 0 100 2 1 1 0 000-2z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neonBlue transition"
              aria-label="YouTube"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.615 3.184C22 3.18 22 3.82 22 7.25v9.5c0 3.43 0 4.07-2.385 4.066-2.025.003-8.99.003-10.984 0C2 20.82 2 20.18 2 16.75v-9.5C2 3.82 2 3.18 4.385 3.184c2.025-.003 8.99-.003 10.984 0zM9 8.625v6.75l5.625-3.375L9 8.625z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:text-neonBlue transition">
                Home
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-neonBlue transition">
                Services
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-neonBlue transition">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-neonBlue transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
          <p className="text-gray-400">123 Future St, Innovation City</p>
          <p className="text-gray-400">Email: info@mrconsultants.com</p>
          <p className="text-gray-400">Phone: +123 456 7890</p>
        </div>

        {/* Map Section */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Our Location</h4>
          <div className="w-full h-48 md:h-40 lg:h-52 rounded-lg overflow-hidden">
            <iframe
              title="Google Map Location"
              className="w-full h-full rounded-lg"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345094117!2d144.9537363153166!3d-37.816279442021024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d5df1d06d1f%3A0x5045675218ce640!2s123+Future+St%2C+Innovation+City!5e0!3m2!1sen!2sus!4v1614123456789!5m2!1sen!2sus"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="mt-12 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
        <p>© 2025 M R Consultants. All Rights Reserved.</p>
        <p className="mt-1">
          <a
            href="http://dubeyabhinav.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neonBlue hover:underline"
          >
            Designed by Abhinav Dubey
          </a>
        </p>
      </div>
    </footer>
  );
}
