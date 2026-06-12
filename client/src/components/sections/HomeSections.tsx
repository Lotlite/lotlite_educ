import React from 'react';
import BestOfBothWorlds from './BestOfBothWorlds';
import WhyLotlite from './WhyLotlite';
import Programs from './Programs';
import FocusAreas from './FocusAreas';
import Outcomes from './Outcomes';
import PracticalLearning from './PracticalLearning';
import Admissions from './Admissions';
import ParentFocus from './ParentFocus';
import FAQ from './FAQ';
import GoogleReviews from './GoogleReviews';

// Existing Sections
import Faculty from './Faculty';
import IndustryMentors from './IndustryMentors';
import IncubatorStories from './IncubatorStories';
import CaseStudies from './CaseStudies';
import Blogs from './Blogs';

const HomeSections: React.FC = () => {
  return (
    <div className="flex flex-col [&>section]:!py-12 md:[&>section]:!py-16">
      <BestOfBothWorlds />
      <WhyLotlite />
      <GoogleReviews />
      <Programs />
      <FocusAreas />
      <Faculty />
      <IndustryMentors />
      <IncubatorStories />
      <CaseStudies />
      <Outcomes />
      <PracticalLearning />
      <ParentFocus />
      <Admissions />
      <FAQ />
      <Blogs />
    </div>
  );
};

export default HomeSections;
