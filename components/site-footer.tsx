"use client"

import Link from "next/link"
import { Github, Mail, FileText } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto max-w-6xl py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Made in EU</span>
            <span>|</span>
            <span>Privacy by Design</span>
            <span>|</span>
            <span>v1.1</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub repository"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link 
              href="mailto:" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Contact us via email"
            >
              <Mail className="w-5 h-5" />
            </Link>
            <Link 
              href="/imprint" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Imprint and legal information"
            >
              <FileText className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}