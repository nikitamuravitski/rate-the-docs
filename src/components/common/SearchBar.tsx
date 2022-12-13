import ChooseLanguage from './ChooseLanguage'
import { Language } from '../../types/Documentation'
import styles from './style.module.css'
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
      className='flex gap-5 items-center'
    >
      <div className={
        styles['searchbar'] + ' ' +
        'first-of-type:input relative bg-[#ffffff20] pr-8 text-white rounded-md border border-neutral-500'
      }>
        <input className='bg-transparent p-4 focus:outline-none' value={search} onChange={e => onSearch(e.target.value)} />
        <svg
          className='absolute top-[calc(50%-10px)] right-4 stroke-neutral-300'
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
        >
          <title>Search icon</title>
          <ellipse ry="7.36111" rx="7.36111" id="svg_3" cy="8.36111" cx="8.36111" strokeWidth="2" fill="none" />
          <line id="svg_5" y2="19" x2="19" y1="12.8934" x1="12.8934" strokeWidth="2" fill="none" />
        </svg>
      </div>
      <ChooseLanguage hideLabel includeAll currentPick={currentLanguage} onChoose={onChooseLanguage} />
    </div>
  )
}

export default SearchBar