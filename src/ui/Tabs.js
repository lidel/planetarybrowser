import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  openTab,
  closeTab,
  changeSelectedTab,
  selectTabList,
  selectSelectedTabId
} from './redux/slices/tabs'

export function Tabs () {
  const tabs = useSelector(selectTabList)
  const selectedTabId = useSelector(selectSelectedTabId)
  const dispatch = useDispatch()

  return (
    <div className='bg-navy' style={{ paddingLeft: 78 }}>
      <div className='flex'>
        <ul className='flex list mv0 pl0'>
          {tabs.map((t, i) => (
            <li
              key={t.id}
              onClick={() => dispatch(changeSelectedTab({ id: t.id }))}
              className={`bt bw1 ${t.id === selectedTabId ? 'bg-snow b--aqua' : 'b--white-10'}`}
            >
              <div className={`pv2 ph3 br ${t.id === selectedTabId ? 'b--snow' : 'b--white-10'} ${i === 0 ? 'bl' : ''}`}>
                <span className={`f7 ${t.id === selectedTabId ? '' : 'snow'}`}>{t.title}</span>
                <button
                  className={`input-reset bw0 bg-transparent b ${t.id === selectedTabId ? '' : 'snow'}`}
                  onClick={() => dispatch(closeTab({ id: t.id }))}
                >
                  ｘ
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className='pa2'>
          <button
            className='input-reset bg-white-10 bw0 white-50 hover-bg-white-20 br1 f4'
            onClick={() => dispatch(openTab())}
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
