import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-900">Useful Links</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-indigo-600">About Us</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-indigo-600">Contact Us</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-indigo-600">FAQs</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-indigo-600">Terms of Service</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-indigo-600">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-900">Careers</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-indigo-600">Blog</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-indigo-600">Partnerships</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-indigo-600">Support</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-indigo-600">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-900">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-indigo-600">Community</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-indigo-600">Social Media</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-indigo-600">Demo</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-indigo-900">StudAIng.</h2>
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-indigo-600">
                <FacebookIcon className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-indigo-600">
                <InstagramIcon className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-indigo-600">
                <LinkedinIcon className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-indigo-600">
                <YoutubeIcon className="h-6 w-6" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-500">
            <Link href="#" className="hover:text-indigo-600">Privacy Policy</Link>
            <Link href="#" className="hover:text-indigo-600">Terms of Service</Link>
            <Link href="#" className="hover:text-indigo-600">Cookie Policy</Link>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            © 2024 StudAIng. All rights reserved
          </div>
          {/* Freepik Attribution Section */}
          <div className="mt-4 text-center text-sm text-gray-500">
            Images sourced from <a href="https://www.freepik.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Freepik</a>.
          </div>
        </div>
      </div>
    </footer>
  );
}
