import React from 'react'
import ChooseLanguage from '../../features/propose/ChooseLanguage'
import { Language } from '../../types/Documentation'

const SearchBar = ({
  onChooseLanguage,
  currentLanguage
}: {
  onChooseLanguage(lang: Language): void,
  currentLanguage: Language | undefined
}) => {
  return (
    <div
      className='flex gap-3'
    >
      <input />
      <ChooseLanguage hideLabel includeAll currentPick={currentLanguage} onChoose={onChooseLanguage} />
    </div>
  )
}

export default SearchBar