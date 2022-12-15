import React, { useState } from 'react'
import InputWithSelect from '../../components/common/InputWithSelect';
import { useDebounce } from '../../hooks/useDebounce';
import { DocVersion, Language } from "../../types/Documentation"
import { trpc } from "../../utils/trpc";
import ChooseLanguage from '../../components/common/ChooseLanguage';
import Input from './Input';
import VersionInput from './VersionInput';
import docVersionHelpers from '../../utils/docVersionHelpers';
import { toast, ToastContentProps } from 'react-toastify';
import { TRPCClientError } from '@trpc/client';

enum fields {
  name = 'name',
  description = 'description',
  linkToDocs = 'linkToDocs',
  linkToRepo = 'linkToRepo',
  packageName = 'packageName',
  docVersion = 'docVersion',
  language = 'language'
}

const messageInitialState = {
  [fields.name]: '',
  [fields.description]: '',
  [fields.linkToDocs]: '',
  [fields.linkToRepo]: '',
  [fields.packageName]: '',
  [fields.docVersion]: ''
}

const Form = () => {
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [linkToDocs, setLinkToDocs] = useState<string>('')
  const [linkToRepo, setLinkToRepo] = useState<string>('')
  const [packageName, setPackageName] = useState<string>('')
  const [docVersion, setDocVersion] = useState<DocVersion>([null, null, null])
  const [language, setLanguage] = useState<Language>(Language.javascript)

  const setters = {
    [fields.name]: setName,
    [fields.description]: setDescription,
    [fields.linkToDocs]: setLinkToDocs,
    [fields.linkToRepo]: setLinkToRepo,
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
    toast.promise(
      createProposalMutation.mutateAsync({ name, description, linkToDocs, linkToRepo, packageName, docVersion, language }),
      {
        pending: {
          render() {
            return <div>Saving</div>
          },
        },
        success: {
          render() {
            return <div>Success</div>
          },
        },
        error: {
          render(props: ToastContentProps<TRPCClientError<any>>) {
            let message
            if (props.data?.message) {
              try {
                message = JSON.parse(props.data?.message)
                const newState = { ...messageInitialState }
                message.map((msg: { message: any, path: string[] }) => {
                  if (!msg.path.length) return
                  const field = msg.path[0]
                  if (!field) return newState[field as keyof typeof newState] = ''
                  newState[field as keyof typeof newState] = msg.message
                });
                setMessage({ ...newState })
              } catch (e) {
                message = props.data.message
              } finally {
                return <div>{Array.isArray(message) ? 'Update fields' : props.data?.message}</div>
              }
            }
          }
        }
      })
  }

  const onSelectPackageHandler = (packageName: string) => {
    const pack = packageData!.find((pack: any) => pack.name === packageName)
    setState(fields.description, (old: string) => pack.description || old)
    setState(fields.linkToRepo, (old: string) => pack.links.repository || old)
    setState(fields.docVersion, (old: DocVersion) => docVersionHelpers.unfold(pack.version) || old)
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
        <Input
          errorMessage={message[fields.linkToRepo]}
          value={linkToRepo}
          onChangeHandler={(value) => setState(fields.linkToRepo, value)}
          label='Link to Repo'
        />
        <VersionInput
          errorMessage={message[fields.docVersion]}
          value={docVersion}
          onChangeHandler={(value) => setState(fields.docVersion, value)}
          label='Doc version'
        />
        <button
          type='button'
          disabled={!!createProposalMutation.isLoading}
          className=" transition-all flex justify-center text-white font-semibold text-lg py-2 px-5 disabled:bg-transparent disabled:outline disabled:-outline-offset-2 disabled:outline-pink-600 enabled:border-transparent enabled:bg-gradient-to-r from-purple-400 to-pink-600 rounded-lg"
          onClick={() => createProposalHandler()}
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default Form