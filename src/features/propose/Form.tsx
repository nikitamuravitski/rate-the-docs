import React, { useState } from 'react'
import { Documentation, Language } from "../../types/Documentation"
import { trpc } from "../../utils/trpc";
import ChooseLanguage from './Choose';

const Form = () => {
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [linkToDocs, setLinkToDocs] = useState<string>('')
  const [npmPackageName, setNpmPackageName] = useState<string>('')
  const [version, setVersion] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [language, setLanguage] = useState<Language>(Language.javascript)
  const createProposalMutation = trpc.documentation.createProposal.useMutation<Documentation>()

  const createProposalHandler = async () => {
    setMessage('')
    createProposalMutation.mutate({ name, description, linkToDocs, npmPackageName, docVersion: version, language }, {
      onError: data => setMessage(data.message),
      onSuccess: data => {
        setMessage('success')
        setTimeout(() => setMessage(''), 5000)
      }
    })
  }

  return (
    <div className="max-w-7xl w-full p-3 self-start flex justify-center">
      <form
        onSubmit={e => {
          e.preventDefault()
          createProposalHandler()
        }}
        className=" flex flex-col max-w-md w-full gap-5"
      >
        <ChooseLanguage currentPick={language} onChoose={(lang: Language) => setLanguage(lang)} />
        <div className="flex w-full justify-between items-center text-white">
          <label htmlFor='currentVersionForProposalInput' >Package name</label>
          <input
            className="w-full max-w-xs rounded-md bg-[#ffffff29] border border-stone-700 p-3"
            required
            autoComplete='off'
            id='currentVersionForProposalInput'
            value={npmPackageName}
            onChange={e => setNpmPackageName(e.target.value)}
          />
        </div>
        <div className="flex w-full justify-between items-center text-white">
          <label htmlFor='nameForProposalInput'>Name</label>
          <input
            className="w-full max-w-xs rounded-md bg-[#ffffff29] border border-stone-700 p-3"
            required
            id='nameForProposalInput'
            autoComplete='off'
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="flex w-full justify-between items-center text-white">
          <label htmlFor='descriptionForProposalInput'>Description</label>
          <textarea
            className="w-full max-w-xs rounded-md bg-[#ffffff29] border border-stone-700 p-3"
            required
            id='descriptionForProposalInput'
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className="flex w-full justify-between items-center text-white">
          <label htmlFor='currentVersionForProposalInput' >Link to docs</label>
          <input
            className="w-full max-w-xs rounded-md bg-[#ffffff29] border border-stone-700 p-3"
            required
            id='currentVersionForProposalInput'
            autoComplete='off'
            type='text'
            value={linkToDocs}
            onChange={e => setLinkToDocs(e.target.value)}
          />
        </div>
        <div className="flex w-full justify-between items-center text-white">
          <label htmlFor='currentVersionForProposalInput' >Docs Version</label>
          <input
            className="w-full max-w-xs rounded-md bg-[#ffffff29] border border-stone-700 p-3"
            required
            id='currentVersionForProposalInput'
            autoComplete='off'
            type='text'
            value={version}
            onChange={e => setVersion(e.target.value)}
          />
        </div>
        <button type="submit" className="text-white font-semibold text-lg py-2 px-5 bg-gradient-to-r from-purple-400 to-pink-600  rounded-lg w-fit">Submit</button>
        <div className="text-white">{message}</div>
      </form>
    </div>
  )
}

export default Form