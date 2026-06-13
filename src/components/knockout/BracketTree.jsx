import { useState } from 'react'
import Flag from '../layout/Flag.jsx'

function Slot({ s }) {
  return (
    <div className={`bk-slot${s.team ? '' : ' ph'}`}>
      {s.team ? <Flag emoji={s.team.flag} w={16} /> : null}
      <span className="bk-name">{s.team ? s.team.name : s.label}</span>
    </div>
  )
}

export default function BracketTree({ bracket }) {
  // Mobilde tek turu tam ekran göstermek için aktif tur (masaüstünde tüm turlar görünür)
  const [active, setActive] = useState(0)

  return (
    <>
      <div className="bk-tabs">
        {bracket.names.map((name, i) => (
          <button
            key={i}
            className={`bk-tab${i === active ? ' active' : ''}`}
            onClick={() => setActive(i)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="bracket">
        {bracket.rounds.map((round, ri) => (
          <div className={`bk-round${ri === active ? ' active' : ''}`} key={ri}>
            <div className="bk-round-title">{bracket.names[ri]}</div>
            <div className="bk-matches">
              {round.map((m) => (
                <div className="bk-match" key={m.id}>
                  <Slot s={m.a} />
                  <Slot s={m.b} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
