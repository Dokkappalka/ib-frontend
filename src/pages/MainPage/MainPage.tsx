import React, { useState, useEffect, FormEvent } from 'react'
import axios, { AxiosResponse } from 'axios'
import styles from './MainPage.module.scss'
import Modal from '../../components/Modal/Modal'

interface IResult {
  'CVSS 2.0': string
  'Вендор ПО': string
  'Версия ПО': string
  'Возможные меры по устранению': string
  'Дата выявления': string
  Идентификатор: string
  'Идентификаторы других систем описаний уязвимости': string
  'Информация об устранении': string
  'Класс уязвимости': string
  'Название ПО': string
  'Наименование ОС и тип аппаратной платформы': string
  'Наименование уязвимости': string
  'Наличие эксплойта': string
  'Описание ошибки CWE': string
  'Описание уязвимости': string
  'Прочая информация': string
  'Ссылки на источники': string
  'Статус уязвимости': string
  'Тип ПО': string
  'Тип ошибки CWE': string
  'Уровень опасности уязвимости': string
}

interface IExploits {
  confirmedExploits: number
  accessExploits: number
  noConfirmed: number
}

interface IVulnerability {
  codeVulnerability: number
  archVulnerability: number
  multiVulnerability: number
}

interface IFixInfo {
  fixed: number
  noFixed: number
}
const MainPage = () => {
  const [fixedCount, setFixedCount] = useState<IFixInfo>({
    fixed: 0,
    noFixed: 0,
  })
  const [exploitsData, setExploitsData] = useState<IExploits>({
    confirmedExploits: 0,
    accessExploits: 0,
    noConfirmed: 0,
  })
  const [vulnerability, setVulnerability] = useState<IVulnerability>({
    codeVulnerability: 0,
    multiVulnerability: 0,
    archVulnerability: 0,
  })
  const [active, setActive] = useState(false)
  const [codes, setCodes] = useState<string[]>([])
  const [chosenCode, setChosenCode] = useState<string>('')
  const [result, setResult] = useState<IResult[]>([])
  const [chosenResult, setChosenResult] = useState<IResult>()
  useEffect(() => {
    axios
      .get('http://localhost:4000/api/codes')
      .then((res: AxiosResponse<string[]>) => {
        setCodes(res.data)
      })
  }, [])

  useEffect(() => {
    result.forEach((el) => {
      if (el['Информация об устранении'] === 'Уязвимость устранена') {
        setFixedCount((prev) => ({ ...prev, fixed: prev.fixed + 1 }))
      } else if (
        el['Информация об устранении'] ===
        'Информация об устранении отсутствует'
      ) {
        setFixedCount((prev) => ({ ...prev, noFixed: prev.noFixed + 1 }))
      }
      if (el['Класс уязвимости'] === 'Уязвимость архитектуры') {
        setVulnerability((prev) => ({
          ...prev,
          archVulnerability: prev.archVulnerability + 1,
        }))
      } else if (el['Класс уязвимости'] === 'Уязвимость кода') {
        setVulnerability((prev) => ({
          ...prev,
          codeVulnerability: prev.codeVulnerability + 1,
        }))
      } else if (el['Класс уязвимости'] === 'Уязвимость многофакторная') {
        setVulnerability((prev) => ({
          ...prev,
          multiVulnerability: prev.multiVulnerability + 1,
        }))
      }
      if (el['Наличие эксплойта'] === 'Существует') {
        setExploitsData((prev) => ({
          ...prev,
          confirmedExploits: prev.confirmedExploits + 1,
        }))
      } else if (el['Наличие эксплойта'] === 'Данные уточняются') {
        setExploitsData((prev) => ({
          ...prev,
          noConfirmed: prev.noConfirmed + 1,
        }))
      } else if (el['Наличие эксплойта'] === 'Существует в открытом доступе') {
        setExploitsData((prev) => ({
          ...prev,
          accessExploits: prev.accessExploits + 1,
        }))
      }
    })
  }, [result])
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (chosenCode.trim()) {
      setFixedCount({ fixed: 0, noFixed: 0 })
      setExploitsData({
        accessExploits: 0,
        confirmedExploits: 0,
        noConfirmed: 0,
      })
      setVulnerability({
        archVulnerability: 0,
        codeVulnerability: 0,
        multiVulnerability: 0,
      })
      await axios
        .get(`http://localhost:4000/api/byProblem?code=${chosenCode}`)
        .then((res: AxiosResponse<IResult[]>) => {
          setResult(res.data)
          console.log(res.data)
        })
    }
  }
  const openInfo = (item: IResult) => {
    setChosenResult(item)
    setActive(true)
  }
  return (
    <div className='mt-5'>
      <p className={styles.codeTitle}>
        Укажите код уязвимости, по которой хотите просмотреть статистику
        <a
          href='https://bdu.fstec.ru/webvulns'
          target='_blank'
          className={styles.helpButton}
        >
          ?
        </a>
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          placeholder='Введите код уязвимости...'
          className={styles.input}
          list='codes'
          value={chosenCode}
          onChange={(e) => {
            setChosenCode(e.target.value)
          }}
        />
        <datalist className={styles.selectCode} id='codes'>
          {codes.map((code) => {
            return code && <option value={code}>{code}</option>
          })}
        </datalist>
        <button className={styles.button}>Найти</button>
      </form>
      {result.length ? (
        <div className={styles.container}>
          <div className={styles.resContainer}>
            {result.map((e) => {
              return (
                <div
                  key={e['Идентификатор']}
                  className={styles.resElement}
                  onClick={() => {
                    openInfo(e)
                  }}
                >
                  {e['Идентификатор']}
                </div>
              )
            })}
          </div>
          <div className={styles.infoContainer}>
            <p className='font-semibold my-3'>Наличие эксплойтов</p>
            <p className='text-start ml-2'>
              Существует: {exploitsData.confirmedExploits}
            </p>
            <p className='text-start ml-2'>
              Существует в открытом доступе: {exploitsData.accessExploits}
            </p>
            <p className='text-start ml-2'>
              Данные уточняются: {exploitsData.noConfirmed}
            </p>
            <p className='font-semibold my-3'>Класс уязвимости</p>
            <p className='text-start ml-2'>
              Уязвимость архитектуры: {vulnerability.archVulnerability}
            </p>
            <p className='text-start ml-2'>
              Уязвимость кода: {vulnerability.codeVulnerability}
            </p>
            <p className='text-start ml-2'>
              Уязвимость многофакторная: {vulnerability.multiVulnerability}
            </p>
            <p className='font-semibold my-3'>Информация об устранении</p>
            <p className='text-start ml-2'>
              Уязвимость устранена: {fixedCount.fixed}
            </p>
            <p className='text-start ml-2'>
              Нет информации об устранении: {fixedCount.noFixed}
            </p>
          </div>
        </div>
      ) : (
        <p className='text-center mt-5 text-red-500'>Тут пока ничего нету...</p>
      )}
      <Modal active={active} setActive={setActive}>
        <div>
          <div className='flex justify-between px-5 mb-1'>
            <h1 className='text-xl text-sky-400 mb-1'>
              {chosenResult?.Идентификатор}
            </h1>
            <p>{chosenResult?.['Дата выявления']}</p>
          </div>
          <p className='text-xs mb-5'>
            {chosenResult?.['Наименование уязвимости']}
          </p>

          <p className='mb-5'>
            <span className='font-semibold'>Описание уязвимости: </span>
            {chosenResult?.['Описание уязвимости']}
          </p>

          <p>
            <span className='font-semibold'>Статус уязвимости: </span>{' '}
            {chosenResult?.['Статус уязвимости']}
          </p>
          <p>
            <span className='font-semibold'>Наличие эксплойта: </span>
            {chosenResult?.['Наличие эксплойта']}
          </p>
          <p>
            <span className='font-semibold'>Класс уязвимости: </span>
            {chosenResult?.['Класс уязвимости']}
          </p>
          <p className='mb-5'>
            <span className='font-semibold'>Информация об устранении: </span>
            {chosenResult?.['Информация об устранении']}
          </p>
          <p>{chosenResult?.['Уровень опасности уязвимости']}</p>
          <p className='mt-5'>
            Возможные меры по устранению
            <p className='text-xs'>
              {chosenResult?.['Возможные меры по устранению']}
            </p>
          </p>
          {chosenResult?.['Ссылки на источники'] && (
            <p className='text-end text-xs mt-5'>
              Ссылки на источники:{' '}
              {chosenResult?.['Ссылки на источники']
                .split('\r\n')
                .map((link, i) => {
                  console.log(chosenResult['Ссылки на источники'])
                  return (
                    <a
                      key={i}
                      target='_blank'
                      href={link}
                      className='text-blue-500 mr-2 hover:underline'
                    >
                      {link}
                    </a>
                  )
                })}
            </p>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default MainPage
