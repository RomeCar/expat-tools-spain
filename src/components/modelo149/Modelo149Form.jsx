import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { STREET_TYPES, PROVINCES, COMMON_COUNTRIES, INITIAL_FORM_DATA } from '../../config/modelo149';
import Modelo149Review from './Modelo149Review';
import { ChevronLeft, ChevronRight, Briefcase, Building2, Rocket, GraduationCap, FlaskConical } from 'lucide-react';

const TOTAL_STEPS = 6;

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

function RadioOption({ name, value, current, label, desc, icon: Icon, onSelect }) {
  const selected = current === value;
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 1rem', background: selected ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-tertiary)', border: `1.5px solid ${selected ? 'var(--accent-primary)' : 'var(--border-color)'}`, borderRadius: '0.5rem', cursor: 'pointer', transition: 'all 0.15s' }}>
      <input type="radio" name={name} checked={selected} onChange={() => onSelect(value)} style={{ marginTop: '0.2rem', accentColor: 'var(--accent-primary)' }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {Icon && <Icon size={16} style={{ color: 'var(--accent-primary)' }} />}
          {label}
        </div>
        {desc && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{desc}</div>}
      </div>
    </label>
  );
}

export default function Modelo149Form() {
  const { t, language } = useLanguage();
  const f = t('modelo149.form');
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_FORM_DATA);

  const update = (field, value) => setData(prev => ({ ...prev, [field]: value }));

  const countries = COMMON_COUNTRIES.map(c => ({ code: c.code, label: language === 'en' ? c.en : c.es }));

  const stepNames = [f.steps.s1, f.steps.s2, f.steps.s3, f.steps.s4, f.steps.s5, f.steps.s6];
  const canGoNext = step < TOTAL_STEPS;
  const canGoBack = step > 1;

  return (
    <div className="glass-card" style={{ padding: '2rem', marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>{f.title}</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{f.subtitle}</p>

      {/* Progress Bar */}
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

      {/* Step Title */}
      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
        {f.step} {step} {f.of} {TOTAL_STEPS}: <strong style={{ color: 'var(--text-primary)' }}>{stepNames[step - 1]}</strong>
      </div>

      {/* Step Content */}
      <div style={{ minHeight: '300px' }}>
        {/* Step 1: Taxpayer Type */}
        {step === 1 && (
          <>
            <h3 style={{ marginBottom: '1rem' }}>{f.taxpayerType.title}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <RadioOption name="taxpayerType" value="primary" current={data.taxpayerType} label={f.taxpayerType.primary} desc={f.taxpayerType.primaryDesc} onSelect={(v) => update('taxpayerType', v)} />
              <RadioOption name="taxpayerType" value="associated" current={data.taxpayerType} label={f.taxpayerType.associated} desc={f.taxpayerType.associatedDesc} onSelect={(v) => update('taxpayerType', v)} />
            </div>
            {data.taxpayerType === 'associated' && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem' }}>
                <Field label={f.taxpayerType.primaryNif}>
                  <input className="input-field" style={inputStyle} value={data.primaryNif} onChange={e => update('primaryNif', e.target.value)} />
                </Field>
                <Field label={f.taxpayerType.primaryName}>
                  <input className="input-field" style={inputStyle} value={data.primaryApellidos} onChange={e => update('primaryApellidos', e.target.value)} placeholder="Apellidos y Nombre" />
                </Field>
                <Field label={f.taxpayerType.primaryRef} help={f.taxpayerType.primaryRefHelp}>
                  <input className="input-field" style={inputStyle} value={data.primaryM149Ref} onChange={e => update('primaryM149Ref', e.target.value)} />
                </Field>
              </div>
            )}
          </>
        )}

        {/* Step 2: Personal Details */}
        {step === 2 && (
          <>
            <h3 style={{ marginBottom: '1rem' }}>{f.details.title}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Field label={f.details.nif} help={f.details.nifHelp}>
                <input className="input-field" style={inputStyle} value={data.nif} onChange={e => update('nif', e.target.value)} placeholder="Y1234567X" />
              </Field>
              <div />
              <Field label={f.details.apellidos} help={f.details.apellidosHelp}>
                <input className="input-field" style={inputStyle} value={data.apellidos} onChange={e => update('apellidos', e.target.value)} />
              </Field>
              <Field label={f.details.nombre}>
                <input className="input-field" style={inputStyle} value={data.nombre} onChange={e => update('nombre', e.target.value)} />
              </Field>
              <Field label={f.details.telefonoMovil}>
                <input className="input-field" style={inputStyle} value={data.telefonoMovil} onChange={e => update('telefonoMovil', e.target.value)} placeholder="+34 6XX XXX XXX" />
              </Field>
              <Field label={f.details.telefonoFijo}>
                <input className="input-field" style={inputStyle} value={data.telefonoFijo} onChange={e => update('telefonoFijo', e.target.value)} />
              </Field>
            </div>

            <div style={{ fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-primary)', marginTop: '1.25rem', marginBottom: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
              {f.details.addressTitle}
            </div>
            <div style={helpStyle}>{f.details.addressHelp}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 80px', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Field label={f.details.tipoVia}>
                <select className="input-field" style={inputStyle} value={data.tipoVia} onChange={e => update('tipoVia', e.target.value)}>
                  {STREET_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label={f.details.nombreVia}>
                <input className="input-field" style={inputStyle} value={data.nombreVia} onChange={e => update('nombreVia', e.target.value)} />
              </Field>
              <Field label={f.details.numero}>
                <input className="input-field" style={inputStyle} value={data.numero} onChange={e => update('numero', e.target.value)} />
              </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem' }}>
              <Field label={f.details.bloque}><input className="input-field" style={inputStyle} value={data.bloque} onChange={e => update('bloque', e.target.value)} /></Field>
              <Field label={f.details.portal}><input className="input-field" style={inputStyle} value={data.portal} onChange={e => update('portal', e.target.value)} /></Field>
              <Field label={f.details.planta}><input className="input-field" style={inputStyle} value={data.planta} onChange={e => update('planta', e.target.value)} /></Field>
              <Field label={f.details.puerta}><input className="input-field" style={inputStyle} value={data.puerta} onChange={e => update('puerta', e.target.value)} /></Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr', gap: '0.75rem' }}>
              <Field label={f.details.codigoPostal}><input className="input-field" style={inputStyle} value={data.codigoPostal} onChange={e => update('codigoPostal', e.target.value)} maxLength={5} /></Field>
              <Field label={f.details.municipio}><input className="input-field" style={inputStyle} value={data.municipio} onChange={e => update('municipio', e.target.value)} /></Field>
              <Field label={f.details.provincia}>
                <select className="input-field" style={inputStyle} value={data.provincia} onChange={e => update('provincia', e.target.value)}>
                  {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </Field>
            </div>
          </>
        )}

        {/* Step 3: Purpose */}
        {step === 3 && (
          <>
            <h3 style={{ marginBottom: '1rem' }}>{f.purpose.title}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <RadioOption name="purpose" value="option" current={data.purpose} label={f.purpose.option} desc={f.purpose.optionDesc} onSelect={(v) => update('purpose', v)} />
              <RadioOption name="purpose" value="renunciation" current={data.purpose} label={f.purpose.renunciation} desc={f.purpose.renunciationDesc} onSelect={(v) => update('purpose', v)} />
              <RadioOption name="purpose" value="exclusion" current={data.purpose} label={f.purpose.exclusion} desc={f.purpose.exclusionDesc} onSelect={(v) => update('purpose', v)} />
              <RadioOption name="purpose" value="endDisplacement" current={data.purpose} label={f.purpose.endDisplacement} desc={f.purpose.endDisplacementDesc} onSelect={(v) => update('purpose', v)} />
            </div>
            {data.purpose === 'option' && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem' }}>
                <Field label={`${f.purpose.docCode} (Box 32)`} help={f.purpose.docCodeHelp}>
                  <input className="input-field" style={inputStyle} value={data.docRegistrationCode} onChange={e => update('docRegistrationCode', e.target.value)} placeholder="CSV code" />
                </Field>
              </div>
            )}
            {data.purpose === 'exclusion' && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem' }}>
                <Field label={f.purpose.exclusionDate}><input type="date" className="input-field" style={inputStyle} value={data.exclusionDate} onChange={e => update('exclusionDate', e.target.value)} /></Field>
                <Field label={f.purpose.exclusionReason}><input className="input-field" style={inputStyle} value={data.exclusionReason} onChange={e => update('exclusionReason', e.target.value)} /></Field>
              </div>
            )}
            {data.purpose === 'endDisplacement' && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem' }}>
                <Field label={f.purpose.endDate}><input type="date" className="input-field" style={inputStyle} value={data.endDisplacementDate} onChange={e => update('endDisplacementDate', e.target.value)} /></Field>
              </div>
            )}
          </>
        )}

        {/* Step 4: Situation/Category (or Associated relation) */}
        {step === 4 && data.taxpayerType === 'associated' && (
          <>
            <h3 style={{ marginBottom: '1rem' }}>{f.dates.associatedRelation}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <RadioOption name="associatedType" value="spouse" current={data.associatedType} label={f.dates.spouse} onSelect={(v) => update('associatedType', v)} />
              <RadioOption name="associatedType" value="parent" current={data.associatedType} label={f.dates.parent} onSelect={(v) => update('associatedType', v)} />
              <RadioOption name="associatedType" value="child" current={data.associatedType} label={f.dates.child} onSelect={(v) => update('associatedType', v)} />
            </div>
            {data.associatedType === 'child' && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem' }}>
                <Field label={f.dates.childDob}><input type="date" className="input-field" style={inputStyle} value={data.childDob} onChange={e => update('childDob', e.target.value)} /></Field>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={data.childDisability} onChange={e => update('childDisability', e.target.checked)} style={{ accentColor: 'var(--accent-primary)' }} />
                  {f.dates.childDisability}
                </label>
              </div>
            )}
          </>
        )}

        {step === 4 && data.taxpayerType !== 'associated' && (
          <>
            <h3 style={{ marginBottom: '1rem' }}>{f.situation.title}</h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{f.situation.categoryLabel}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <RadioOption name="category" value="employment" current={data.category} label={f.situation.employment} desc={f.situation.employmentDesc} icon={Briefcase} onSelect={(v) => update('category', v)} />
              <RadioOption name="category" value="director" current={data.category} label={f.situation.director} desc={f.situation.directorDesc} icon={Building2} onSelect={(v) => update('category', v)} />
              <RadioOption name="category" value="entrepreneur" current={data.category} label={f.situation.entrepreneur} desc={f.situation.entrepreneurDesc} icon={Rocket} onSelect={(v) => update('category', v)} />
              <RadioOption name="category" value="professional" current={data.category} label={f.situation.professional} desc={f.situation.professionalDesc} icon={GraduationCap} onSelect={(v) => update('category', v)} />
              <RadioOption name="category" value="research" current={data.category} label={f.situation.research} desc={f.situation.researchDesc} icon={FlaskConical} onSelect={(v) => update('category', v)} />
            </div>

            {/* Conditional sub-fields */}
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem' }}>
              {data.category === 'employment' && (
                <>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{f.situation.empType}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                    <RadioOption name="employmentType" value="newJob" current={data.employmentType} label={f.situation.newJob} onSelect={(v) => update('employmentType', v)} />
                    <RadioOption name="employmentType" value="transfer" current={data.employmentType} label={f.situation.transfer} onSelect={(v) => update('employmentType', v)} />
                    <RadioOption name="employmentType" value="remote" current={data.employmentType} label={f.situation.remote} onSelect={(v) => update('employmentType', v)} />
                  </div>
                  <Field label={f.situation.employerNif}><input className="input-field" style={inputStyle} value={data.employerNif} onChange={e => update('employerNif', e.target.value)} /></Field>
                  <Field label={f.situation.employerName}><input className="input-field" style={inputStyle} value={data.employerName} onChange={e => update('employerName', e.target.value)} /></Field>
                </>
              )}
              {data.category === 'director' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                    <RadioOption name="directorType" value="standard" current={data.directorType} label={f.situation.dirStandard} onSelect={(v) => update('directorType', v)} />
                    <RadioOption name="directorType" value="patrimonial" current={data.directorType} label={f.situation.dirPatrimonial} onSelect={(v) => update('directorType', v)} />
                  </div>
                  <Field label={f.situation.entityNif}><input className="input-field" style={inputStyle} value={data.entityNif} onChange={e => update('entityNif', e.target.value)} /></Field>
                  <Field label={f.situation.entityName}><input className="input-field" style={inputStyle} value={data.entityName} onChange={e => update('entityName', e.target.value)} /></Field>
                </>
              )}
              {(data.category === 'professional' || data.category === 'research') && (
                <>
                  <Field label={f.situation.entityNif}><input className="input-field" style={inputStyle} value={data.entityNif} onChange={e => update('entityNif', e.target.value)} /></Field>
                  <Field label={f.situation.entityName}><input className="input-field" style={inputStyle} value={data.entityName} onChange={e => update('entityName', e.target.value)} /></Field>
                </>
              )}
              {data.category === 'entrepreneur' && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {language === 'en' ? 'No additional fields required. You may need a favorable ENISA report.' : 'No se requieren campos adicionales. Puede necesitar un informe favorable de ENISA.'}
                </div>
              )}
            </div>
          </>
        )}

        {/* Step 5: Dates */}
        {step === 5 && (
          <>
            <h3 style={{ marginBottom: '1rem' }}>{f.dates.title}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Field label={f.dates.entryDate} help={f.dates.entryDateHelp}>
                <input type="date" className="input-field" style={inputStyle} value={data.entryDate} onChange={e => update('entryDate', e.target.value)} />
              </Field>
              <Field label={f.dates.activityStart} help={f.dates.activityStartHelp}>
                <input type="date" className="input-field" style={inputStyle} value={data.activityStartDate} onChange={e => update('activityStartDate', e.target.value)} />
              </Field>
              <Field label={f.dates.lastResidence} help={f.dates.lastResidenceHelp}>
                <select className="input-field" style={inputStyle} value={data.lastTaxResidence} onChange={e => update('lastTaxResidence', e.target.value)}>
                  <option value="">--</option>
                  {countries.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                </select>
              </Field>
              <Field label={f.dates.nationality}>
                <select className="input-field" style={inputStyle} value={data.nationality} onChange={e => update('nationality', e.target.value)}>
                  <option value="">--</option>
                  {countries.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                </select>
              </Field>
            </div>
          </>
        )}

        {step === 6 && <Modelo149Review data={data} />}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={() => canGoBack && setStep(s => s - 1)}
          disabled={!canGoBack}
          className="btn-secondary"
          style={{ opacity: canGoBack ? 1 : 0.4, padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
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
