import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import NewsLetterBox from '../components/NewsLetterBox'
import OurPolicy from '../components/OurPolicy'
import RelatedProducts from '../components/RelatedProducts'

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <NewsLetterBox />
      <OurPolicy />
      <RelatedProducts />
    </div>
  )
}

export default Home
