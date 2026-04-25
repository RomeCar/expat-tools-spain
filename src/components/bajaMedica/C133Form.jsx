import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { PRESTACIONES, CONTRACT_TYPES, TRAMOS_2026, INITIAL_C133_DATA, requiredBaseMonths, getBaseForTramo } from '../../config/bajaMedica';
import C133Review from './C133Review';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TOTAL_STEPS = 5;

const inputStyle = { padding: '0.5rem', fontSize: '0.875rem' };
const labelStyle = { fontSize: '0.8rem', marginBottom: '0.25rem', color: 'var(--text-secondary)', fontWeight: '500' };
const helpStyle = { fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' };
const groupStyle = { marginBottom: '0.75rem' };

// Helpers defined at module level so React doesn't remount inputs on every keystroke.
function Field({ label, help, children }) {
  return (
    <div style={groupStyle}>
      <label style={labelStyle}>{label}</label>
      {children}
      {help && <div style={helpStyle}>{help}</div>}
    </div>
  );
}

function RadioOption({ name, value, current, label, desc, onSelect }) {
  const selected = current === value;
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 1rem', background: selected ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-tertiary)', border: `1.5px solid ${selected ? 'var(--accent-primary)' : 'var(--border-color)'}`, borderRadius: '0.5rem', cursor: 'pointer', transition: 'all 0.15s' }}>
      <input type="radio" name={name} checked={selected} onChange={() => onSelect(value)} style={{ marginTop: '0.2rem', accentColor: 'var(--accent-primary)' }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{label}</div>
        {desc && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{desc}</div>}
      </div>
    </label>
  );
}

export default function C133Form() {
  const { t, language } = useLanguage();
  const f = t('bajaMedica.form');
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_C133_DATA);

  const update = (field, value) => setData(prev => ({ ...prev, [field]: value }));
  const updateBase = (idx, field, value) => {
    setData(prev => {
      const bases = [...prev.bases];
      bases[idx] = { ...bases[idx], [field]: value };
      return { ...prev, bases };
    });
  };
  const addBaseRow = () => setData(prev => ({ ...prev, bases: [...prev.bases, { anio: '', mes: '', dias: '', base: '' }] }));
  const removeBaseRow = (idx) => setData(prev => ({ ...prev, bases: prev.bases.filter((_, i) => i !== idx) }));

  const stepNames = [f.steps.s1, f.steps.s2, f.steps.s3, f.steps.s4, f.steps.s5];
  const canGoBack = step > 1;
  const canGoNext = step < TOTAL_STEPS;
  const isNcm = data.prestacion === 'NCM';
  const months = language === 'en' ? t('common.months') : t('common.monthsES');

  const required = requiredBaseMonths(data.prestacion, data.contractType);
  const suggestedBase = getBaseForTramo(data.tramo);

  return (
    <div className="glass-card" style={{ padding: '2rem', marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '0.25rem', fontSize: '1.5rem' }}>{f.title}</h2>
      <div style={{ display: 'inline-block', marginBottom: '0.75rem', padding: '0.25rem 0.75rem', background: 'rgba(37, 99, 235, 0.08)', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {f.headerBadge}
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{f.subtitle}</p>

      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.5rem' }}>
        {stepNames.map((name, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ height: '4px', borderRadius: '2px', background: i + 1 <= step ? 'var(--accent-primary)' : 'var(--border-color)', transition: 'background 0.2s' }} />
            <div style={{ fontSize: '0.65rem', color: i + 1 === step ? 'var(--accent-primary)' : 'var(--text-tertiary)', marginTop: '0.35rem', fontWeight: i + 1 === step ? '600' : '400' }}>
              {f.step} {i + 1}
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
        {f.step} {step} {f.of} {TOTAL_STEPS}: <strong style={{ color: 'var(--text-primary)' }}>{stepNames[step - 1]}</strong>
      </div>

      <div style={{ minHeight: '300px' }}>
        {/* Step 1: Prestación */}
        {step === 1 && (
          <>
            <h3 style={{ marginBottom: '1rem' }}>{f.steps.s1}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>{f.prestacion.help}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {PRESTACIONES.map(p => (
                <RadioOption key={p.code} name="prestacion" value={p.code} current={data.prestacion} label={language === 'en' ? p.en : p.es} onSelect={(v) => update('prestacion', v)} />
              ))}
            </div>
          </>
        )}

        {/* Step 2: Empleador */}
        {step === 2 && (
          <>
            <h3 style={{ marginBottom: '1rem' }}>{f.steps.s2}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
              <Field label={f.employer.name}><input className="input-field" style={inputStyle} value={data.empName} onChange={e => update('empName', e.target.value)} placeholder="Apellidos y nombre" /></Field>
              <Field label={f.employer.dni}><input className="input-field" style={inputStyle} value={data.empDni} onChange={e => update('empDni', e.target.value)} /></Field>
            </div>
            <Field label={f.employer.ccc} help={f.employer.cccHelp}>
              <input className="input-field" style={inputStyle} value={data.empCcc} onChange={e => update('empCcc', e.target.value)} placeholder="28/1234567/89" />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '0.75rem' }}>
              <Field label={f.employer.via}><input className="input-field" style={inputStyle} value={data.empVia} onChange={e => update('empVia', e.target.value)} placeholder="Calle Mayor 1" /></Field>
              <Field label={f.employer.numero}><input className="input-field" style={inputStyle} value={data.empNumero} onChange={e => update('empNumero', e.target.value)} /></Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '0.75rem' }}>
              <Field label={f.employer.bloque}><input className="input-field" style={inputStyle} value={data.empBloque} onChange={e => update('empBloque', e.target.value)} /></Field>
              <Field label={f.employer.escalera}><input className="input-field" style={inputStyle} value={data.empEscalera} onChange={e => update('empEscalera', e.target.value)} /></Field>
              <Field label={f.employer.piso}><input className="input-field" style={inputStyle} value={data.empPiso} onChange={e => update('empPiso', e.target.value)} /></Field>
              <Field label={f.employer.puerta}><input className="input-field" style={inputStyle} value={data.empPuerta} onChange={e => update('empPuerta', e.target.value)} /></Field>
              <Field label={f.employer.cp}><input className="input-field" style={inputStyle} value={data.empCp} onChange={e => update('empCp', e.target.value)} maxLength={5} /></Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: '0.75rem' }}>
              <Field label={f.employer.localidad}><input className="input-field" style={inputStyle} value={data.empLocalidad} onChange={e => update('empLocalidad', e.target.value)} /></Field>
              <Field label={f.employer.provincia}><input className="input-field" style={inputStyle} value={data.empProvincia} onChange={e => update('empProvincia', e.target.value)} /></Field>
              <Field label={f.employer.telefono}><input className="input-field" style={inputStyle} value={data.empTelefono} onChange={e => update('empTelefono', e.target.value)} /></Field>
            </div>
          </>
        )}

        {/* Step 3: Trabajadora + fechas */}
        {step === 3 && (
          <>
            <h3 style={{ marginBottom: '1rem' }}>{f.steps.s3}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
              <Field label={f.worker.name}><input className="input-field" style={inputStyle} value={data.workName} onChange={e => update('workName', e.target.value)} placeholder="Apellidos y nombre" /></Field>
              <Field label={f.worker.nss} help={f.worker.nssHelp}><input className="input-field" style={inputStyle} value={data.workNss} onChange={e => update('workNss', e.target.value)} placeholder="28 / XXXXXXXX / XX" /></Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Field label={f.worker.dni}><input className="input-field" style={inputStyle} value={data.workDni} onChange={e => update('workDni', e.target.value)} /></Field>
              <Field label={f.worker.telefono}><input className="input-field" style={inputStyle} value={data.workTelefono} onChange={e => update('workTelefono', e.target.value)} /></Field>
            </div>

            <div style={{ marginTop: '0.75rem', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{f.worker.contractTitle}</div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {CONTRACT_TYPES.map(ct => (
                <label key={ct.code} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: data.contractType === ct.code ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-tertiary)', border: `1.5px solid ${data.contractType === ct.code ? 'var(--accent-primary)' : 'var(--border-color)'}`, borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input type="radio" name="contractType" checked={data.contractType === ct.code} onChange={() => update('contractType', ct.code)} style={{ accentColor: 'var(--accent-primary)' }} />
                  {language === 'en' ? ct.en : ct.es}
                </label>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
              <Field label={f.worker.tramo} help={f.worker.tramoHelp}>
                <select className="input-field" style={inputStyle} value={data.tramo} onChange={e => update('tramo', e.target.value)}>
                  <option value="">--</option>
                  {TRAMOS_2026.map(tr => <option key={tr.tramo} value={tr.tramo}>Tramo {tr.tramo} {tr.base ? `(${tr.base.toFixed(2)} EUR)` : '(salario real)'}</option>)}
                </select>
              </Field>
              <Field label={f.worker.fechaInicio} help={f.worker.fechaInicioHelp}>
                <input type="date" className="input-field" style={inputStyle} value={data.fechaInicio} onChange={e => update('fechaInicio', e.target.value)} />
              </Field>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Field label={isNcm ? f.worker.fechaInterrupcionNcm : f.worker.fechaInterrupcion} help={isNcm ? f.worker.fechaInterrupcionNcmHelp : f.worker.fechaInterrupcionHelp}>
                <input type="date" className="input-field" style={inputStyle} value={data.fechaInterrupcion} onChange={e => update('fechaInterrupcion', e.target.value)} />
              </Field>
              <Field label={f.worker.fechaPrevistaFin} help={f.worker.fechaPrevistaFinHelp}>
                <input type="date" className="input-field" style={inputStyle} value={data.fechaPrevistaFin} onChange={e => update('fechaPrevistaFin', e.target.value)} />
              </Field>
            </div>

            {isNcm && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{f.worker.ncmTitle}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <Field label={f.worker.fechaInicioObligatorio}><input type="date" className="input-field" style={inputStyle} value={data.fechaInicioObligatorio} onChange={e => update('fechaInicioObligatorio', e.target.value)} /></Field>
                  <Field label={f.worker.fechaFinObligatorio}><input type="date" className="input-field" style={inputStyle} value={data.fechaFinObligatorio} onChange={e => update('fechaFinObligatorio', e.target.value)} /></Field>
                </div>
              </div>
            )}
          </>
        )}

        {/* Step 4: Bases de cotización */}
        {step === 4 && (
          <>
            <h3 style={{ marginBottom: '0.5rem' }}>{f.steps.s4}</h3>
            <div style={{ background: 'rgba(37, 99, 235, 0.08)', padding: '0.75rem 1rem', borderRadius: '0.5rem', borderLeft: '4px solid var(--accent-primary)', marginBottom: '1rem' }}>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                {f.bases.required.replace('{n}', required).replace('{type}', data.contractType === 'completo' ? f.bases.completo : f.bases.parcial)}
                {suggestedBase != null && <><br />{f.bases.tramoHint.replace('{base}', suggestedBase.toFixed(2))}</>}
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '0.4rem', borderBottom: '2px solid var(--border-color)', fontWeight: '600', fontSize: '0.75rem', textAlign: 'left', color: 'var(--text-secondary)' }}>{f.bases.year}</th>
                    <th style={{ padding: '0.4rem', borderBottom: '2px solid var(--border-color)', fontWeight: '600', fontSize: '0.75rem', textAlign: 'left', color: 'var(--text-secondary)' }}>{f.bases.month}</th>
                    <th style={{ padding: '0.4rem', borderBottom: '2px solid var(--border-color)', fontWeight: '600', fontSize: '0.75rem', textAlign: 'left', color: 'var(--text-secondary)' }}>{f.bases.days}</th>
                    <th style={{ padding: '0.4rem', borderBottom: '2px solid var(--border-color)', fontWeight: '600', fontSize: '0.75rem', textAlign: 'left', color: 'var(--text-secondary)' }}>{f.bases.base}</th>
                    <th style={{ padding: '0.4rem', borderBottom: '2px solid var(--border-color)' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {data.bases.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '0.3rem' }}><input className="input-field" style={{ ...inputStyle, width: '70px' }} value={row.anio} onChange={e => updateBase(idx, 'anio', e.target.value)} placeholder="2026" /></td>
                      <td style={{ padding: '0.3rem' }}>
                        <select className="input-field" style={{ ...inputStyle, width: '120px' }} value={row.mes} onChange={e => updateBase(idx, 'mes', e.target.value)}>
                          <option value="">--</option>
                          {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '0.3rem' }}><input type="number" className="input-field" style={{ ...inputStyle, width: '70px' }} value={row.dias} onChange={e => updateBase(idx, 'dias', e.target.value)} placeholder="30" /></td>
                      <td style={{ padding: '0.3rem' }}><input type="number" step="0.01" className="input-field" style={{ ...inputStyle, width: '110px' }} value={row.base} onChange={e => updateBase(idx, 'base', e.target.value)} placeholder={suggestedBase != null ? suggestedBase.toFixed(2) : '0.00'} /></td>
                      <td style={{ padding: '0.3rem' }}>
                        {data.bases.length > 1 && (
                          <button onClick={() => removeBaseRow(idx)} style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '0.25rem', color: 'var(--danger)', cursor: 'pointer', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>{f.bases.remove}</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={addBaseRow} className="btn-secondary" style={{ marginTop: '0.5rem', padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>+ {f.bases.add}</button>

            <Field label={f.bases.observaciones}>
              <textarea className="input-field" style={{ ...inputStyle, minHeight: '60px', fontFamily: 'inherit' }} value={data.observaciones} onChange={e => update('observaciones', e.target.value)} />
            </Field>

            <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{f.signature.title}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 1fr', gap: '0.75rem' }}>
                <Field label={f.signature.localidad}><input className="input-field" style={inputStyle} value={data.firmaLocalidad} onChange={e => update('firmaLocalidad', e.target.value)} /></Field>
                <Field label={f.signature.dia}><input className="input-field" style={inputStyle} value={data.firmaDia} onChange={e => update('firmaDia', e.target.value)} maxLength={2} /></Field>
                <Field label={f.signature.mes}><input className="input-field" style={inputStyle} value={data.firmaMes} onChange={e => update('firmaMes', e.target.value)} /></Field>
                <Field label={f.signature.anio}><input className="input-field" style={inputStyle} value={data.firmaAnio} onChange={e => update('firmaAnio', e.target.value)} maxLength={4} /></Field>
              </div>
            </div>
          </>
        )}

        {step === 5 && <C133Review data={data} />}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <button onClick={() => canGoBack && setStep(s => s - 1)} disabled={!canGoBack} className="btn-secondary" style={{ opacity: canGoBack ? 1 : 0.4, padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          <ChevronLeft size={16} /> {f.back}
        </button>
        {canGoNext && (
          <button onClick={() => setStep(s => s + 1)} className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
            {f.next} <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
