import './App.css';
import React, { useState, useEffect } from 'react';

import test_json from './test';

function FnKey(props) {
  return (
    <div className='FnKey' onClick={() => {
      props.selkey(props.code);
    }}>
      {props.code}
    </div>
  );
}

function ActionSpecifier(props) {
  return (
    <div>
      <div className={'Action-Specifier ' + props.showSpec[0].name.replace(' ', '_')}>
      </div>
      <div className='specButtonArea'>
        <button className='specSubmit' onClick={() => {
          props.showSpec[1]({
            visible: !props.showSpec[0].visible,
            name: props.showSpec[0].name.replace(' ', '_')
          })
        }}>
          Save
        </button>
        <button className='specCancel' onClick={() => {
          props.showSpec[1]({
            visible: !props.showSpec[0].visible,
            name: props.showSpec[0].name.replace(' ', '_')
          })
        }}>
          Cancel
        </button>
      </div>
    </div>
  )
}

function ActionBtn(props) {
  if (props.useShowSpec) {
    return (
      <div className={'ActionBtn ' + props.name.replace(' ', '_')} onClick={() => {
        props.useShowSpec({
          visible: true,
          name: props.name.replace(' ', '_')
        })
      }}>
        {props.name}
      </div>
    )
  } else {
    return (
      <div className={'ActionBtn ' + props.name.replace(' ', '_')}>
        {props.name}
      </div>
    )
  }
}

function Profile(props) {
  return (
    <div className={'Profile' + props.now_on} onClick={() => {
      props.profiles[1]({
        list: props.profiles[0].list,
        now_on: props.profile
      })
      props.useSelKey('Select Key to Map')
      if (props.showSpec[0].visible) {
        props.showSpec[1]({
          visible: !props.showSpec[0].visible,
          name: props.showSpec[0].name.replace(' ', '_')
        })
      }
    }}>
      {props.profile}
    </div>
  )
}

function Profiles(props) {
  var profiles = props.profiles[0]
  var useProfiles = props.profiles[1]
  return (
    <div className='Profiles'>
      <div className='ProfileArea'>
        {profiles.list.map(profile => {
          if (profiles.now_on == profile) {
            return (
              <Profile now_on={' now_on'} profile={profile} profiles={[profiles, useProfiles]} showSpec={props.showSpec} useSelKey={props.useSelKey} />
            )
          }
          else {
            return (
              <Profile now_on={''} profile={profile} profiles={[profiles, useProfiles]} showSpec={props.showSpec} useSelKey={props.useSelKey} />
            )
          }
        })}
      </div>
      <hr className='solid' />
    </div>
  )
}

function ChainBtn(props) {
  return (
    <div className='ChainBtn'>
      {props.name}
    </div>
  )
}

function SettingPage(props) {
  const [config, useConfig] = useState(test_json)
  const [showSpec, useShowSpec] = useState({
    visible: false,
    name: ''
  })
  const [selKey, useSelKey] = useState('Select Key to Map')
  const [profiles, useProfiles] = useState({
    list: Object.keys(test_json),
    now_on: 'Profile 1'
  })
  return (
    <div className="SettingPage">
      <Profiles profiles={[profiles, useProfiles]} showSpec={[showSpec, useShowSpec]} useSelKey={useSelKey} />
      <div className='FnKeys'>
        {
          Array.from({ length: 12 }, (v, i) => i + 13).map(v => {
            return (
              <FnKey code={'f' + v} selkey={useSelKey} />
            );
          })
        }
      </div>
      <div className='Preference'>
        <div className='Key'>
          {selKey}
        </div>
        <hr />
        <div className='Chain-title'>
          Current Action Chain :
        </div>
        <div className='Chains'>
          {
            config[profiles.now_on][selKey].chains.map(chain => {
              return (
                <ChainBtn name={chain.name} />
              )
            })
          }
        </div>
        <div className='Options'>
          Overlay<br />
          <div className='Overlay-ops ops'>
            {
              ['Previous', 'Current', 'Next'].map(v => {
                return (
                  <ActionBtn name={v} />
                );
              })
            }
          </div>
          Discord<br />
          <div className='Discord-ops ops'>
            {
              ['Mute', 'Deaf'].map(v => {
                return (
                  <ActionBtn name={v} />
                );
              })
            }
          </div>
          Action<br />
          <div className='Action-ops ops'>
            {
              ['HotKey', 'Run Program', 'Run Command', 'Write Text'].map(v => {
                return (
                  <ActionBtn name={v} useShowSpec={useShowSpec} />
                );
              })
            }
          </div>
          <div className='specArea'>
            {showSpec.visible ? <ActionSpecifier showSpec={[showSpec, useShowSpec]} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SettingPage />
      </header>
    </div>
  );
}

export default App;
