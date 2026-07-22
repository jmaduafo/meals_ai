import React from 'react'
import Paragraph from '../headings/Paragraph'

function LandingFooter() {
  return (
    <footer className='py-8 border-t border-t-foreground/10 dark:border-t-background/10'>
        <Paragraph className='text-center' text="©2026 MealWise AI. Not a substitute for medical or dietetic advice."/>
    </footer>
  )
}

export default LandingFooter