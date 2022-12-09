import React, { useState } from 'react'
import ChooseLanguage from '../../features/propose/ChooseLanguage'
import { Language } from '../../types/Documentation'

const SearchBar = ({
  onSearch,
  search,
  onChooseLanguage,
  currentLanguage
}: {
  onSearch(...args: any): void,
  search: string,
  onChooseLanguage(lang: Language): void,
  currentLanguage: Language | undefined
}) => {
  return (
    <div
      className='flex gap-3'
    >
      <input value={search} onChange={e => onSearch(e.target.value)} />
      <ChooseLanguage hideLabel includeAll currentPick={currentLanguage} onChoose={onChooseLanguage} />
    </div>
  )
}

export default SearchBar