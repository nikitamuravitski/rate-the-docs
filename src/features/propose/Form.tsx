import React, { useState } from 'react'
import InputWithSelect from '../../components/common/InputWithSelect';
import { useDebounce } from '../../hooks/useDebounce';
import { DocVersion, Language } from "../../types/Documentation"
import { trpc } from "../../utils/trpc";
import ChooseLanguage from '../../components/common/ChooseLanguage';
import Input from './Input';
import VersionInput from './VersionInput';

enum fields {
  name = 'name',
  description = 'description',
  linkToDocs = 'linkToDocs',
  packageName = 'packageName',
  docVersion = 'docVersion',
  language = 'language'
}

const messageInitialState = {
  [fields.name]: '',
  [fields.description]: '',
  [fields.linkToDocs]: '',
  [fields.packageName]: '',
  [fields.docVersion]: ''
}

const Form = () => {
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [linkToDocs, setLinkToDocs] = useState<string>('')
  const [packageName, setPackageName] = useState<string>('')
  const [docVersion, setDocVersion] = useState<DocVersion>([null, null, null])
  const [language, setLanguage] = useState<Language>(Language.javascript)

  const setters = {
    [fields.name]: setName,
    [fields.description]: setDescription,
    [fields.linkToDocs]: setLinkToDocs,
    [fields.packageName]: setPackageName,
    [fields.docVersion]: setDocVersion
  }

  const [message, setMessage] = useState({ ...messageInitialState })

  const setState = (field: `${fields}`, value: any) => {
    setMessage((old) => {
      return { ...old, [field]: '' }
    })
    setters[field as keyof typeof setters](value)
  }

  const debouncedPackageName: string = useDebounce<string>(packageName, 300);

  const createProposalMutation = trpc.documentation.createProposal.useMutation()

  const { data: packageData, isFetching: isPackageDataFetching } = trpc.packageInfo.getPackageRegistrySearchInfo.useQuery({
    query: debouncedPackageName,
  }, {
    enabled: !!debouncedPackageName && language === Language.javascript
  })

  const createProposalHandler = async () => {
    createProposalMutation.mutate({ name, description, linkToDocs, packageName, docVersion, language }, {
      onError: ({ message: fetchedMessage }) => {
        const messages = JSON.parse(fetchedMessage)
        const newState = { ...messageInitialState }
        messages.map((msg: { message: any, path: string[] }) => {
          if (!msg.path.length) return
          const field = msg.path[0]
          if (!field) return newState[field as keyof typeof newState] = ''
          newState[field as keyof typeof newState] = msg.message
        });
        setMessage({ ...newState })
      },
      onSuccess: data => {
        setMessage({ ...messageInitialState })
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
        onSubmit={e => e.preventDefault()}
        className=" flex flex-col max-w-md w-full gap-5"
        autoComplete='off'
      >
        <ChooseLanguage currentPick={language} onChoose={(lang: Language) => setLanguage(lang)} />
        {language === Language.javascript ?
          <InputWithSelect
            errorMessage={message[fields.packageName]}
            getOptionDisplayValue={(option) => option.name}
            loading={isPackageDataFetching}
            label='Package name'
            onChangeHandler={(value) => setState(fields.packageName, value)}
            onSelectHandler={onSelectPackageHandler}
            value={packageName}
            options={packageData} />
          :
          <Input
            errorMessage={message[fields.packageName]}
            value={packageName}
            onChangeHandler={(value) => setState(fields.packageName, value)}
            label='Package name'
          />
        }
        <Input
          errorMessage={message[fields.name]}
          value={name}
          onChangeHandler={(value) => setState(fields.name, value)}
          label='Name'
        />
        <Input
          errorMessage={message[fields.description]}
          value={description}
          onChangeHandler={(value) => setState(fields.description, value)}
          label='Description'
          multiline
        />
        <Input
          errorMessage={message[fields.linkToDocs]}
          value={linkToDocs}
          onChangeHandler={(value) => setState(fields.linkToDocs, value)}
          label='Link to docs'
        />
        <VersionInput
          errorMessage={message[fields.docVersion]}
          value={docVersion}
          onChangeHandler={(value) => setState(fields.docVersion, value)}
          label='Doc version'
        />
        <button
          type='button'
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