import React, { useState } from 'react'
import InputWithSelect from '../../components/common/InputWithSelect';
import { useDebounce } from '../../hooks/useDebounce';
import { Documentation, Language } from "../../types/Documentation"
import { trpc } from "../../utils/trpc";
import ChooseLanguage from './Choose';
import Input from './Input';
import VersionInput from './VersionInput';

const Form = () => {
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [linkToDocs, setLinkToDocs] = useState<string>('')
  const [packageName, setPackageName] = useState<string>('')
  const [docVersion, setDocVersion] = useState<string>('')
  const [message, setMessage] = useState({
    name: '',
    description: '',
    linkToDocs: '',
    packageName: '',
    docVersion: ''
  })
  const [language, setLanguage] = useState<Language>(Language.javascript)
  const debouncedPackageName: string = useDebounce<string>(packageName, 300);

  const createProposalMutation = trpc.documentation.createProposal.useMutation<Documentation>()

  const { data: packageData, isFetching: isPackageDataFetching } = trpc.packageInfo.getPackageRegistrySearchInfo.useQuery({
    query: debouncedPackageName,
  }, {
    enabled: language === Language.javascript
  })

  const createProposalHandler = async () => {
    setMessage({
      name: '',
      description: '',
      linkToDocs: '',
      packageName: '',
      docVersion: ''
    })
    createProposalMutation.mutate({ name, description, linkToDocs, packageName, docVersion, language }, {
      onError: ({ message: fetchedMessage }) => {
        setMessage((old) => {
          const messages = JSON.parse(fetchedMessage)
          messages.forEach((msg: { message: any, path: string[] }) => {
            const field = msg.path[0]
            if (!field) return old
            old[field as keyof typeof old] = msg.message
          });
          return old
        })
      },
      onSuccess: data => {
        // some notification here
      }
    })
  }
  const onSelectPackageHandler = (packageName: string) => {
    const pack = packageData.find((pack: any) => pack.name === packageName)
    setDescription(pack.description)
  }

  return (
    <div className="max-w-7xl w-full p-3 self-start flex justify-center">
      <form
        onSubmit={e => {
          e.preventDefault()
        }}
        className=" flex flex-col max-w-md w-full gap-5"
        autoComplete='off'
      >
        <ChooseLanguage currentPick={language} onChoose={(lang: Language) => setLanguage(lang)} />
        {language === Language.javascript ?
          <InputWithSelect
            errorMessage={message.packageName}
            getOptionDisplayValue={(option) => option.name}
            loading={isPackageDataFetching}
            label='Package name'
            onChangeHandler={setPackageName}
            onSelectHandler={onSelectPackageHandler}
            value={packageName}
            options={packageData} />
          :
          <Input
            errorMessage={message.packageName}
            value={packageName}
            onChangeHandler={(value) => setPackageName(value)}
            label='Package name'
          />
        }
        <Input
          errorMessage={message.name}
          value={name}
          onChangeHandler={(value) => setName(value)}
          label='Name'
        />
        <Input
          errorMessage={message.description}
          value={description}
          onChangeHandler={(value) => setDescription(value)}
          label='Description'
        />
        <Input
          errorMessage={message.linkToDocs}
          value={linkToDocs}
          onChangeHandler={(value) => setLinkToDocs(value)}
          label='Link to docs'
        />
        <Input
          errorMessage={message.docVersion}
          value={docVersion}
          onChangeHandler={(value) => setDocVersion(value)}
          label='Doc version'
        />
        <button
          className="text-white font-semibold text-lg py-2 px-5 bg-gradient-to-r from-purple-400 to-pink-600  rounded-lg w-fit"
          onClick={() => createProposalHandler()}
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default Form