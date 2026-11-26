import React from 'react';
import { ARCHITECTURE_STEPS } from '../data/scenarios';
import { ArrowRightIcon, CpuIcon, PhoneIcon, SendIcon, SplitIcon } from './Icons';

const STEP_ICONS = [PhoneIcon, SplitIcon, CpuIcon, SendIcon];

export default function ArchitectureFlow() {
  return (
    <section className="section" id="architecture" aria-labelledby="architecture-heading">
      <div className="section-head">
        <span className="eyebrow">Simple Architecture Flow</span>
        <h2 id="architecture-heading" className="section-title">
          Four calm steps from ring to summary
        </h2>
        <p className="section-subtitle">
          No complex setup to decode. Every call follows one predictable, privacy-first path.
        </p>
      </div>

      <ol className="flow-grid">
        {ARCHITECTURE_STEPS.map((step, index) => {
          const IconComponent = STEP_ICONS[index];
          return (
            <li key={step.number} className="flow-card">
              <div className="flow-top">
                <span className="flow-icon">
                  <IconComponent size={18} />
                </span>
                <span className="flow-num">{step.number}</span>
              </div>
              <h3 className="flow-title">{step.title}</h3>
              <span className="flow-caption">{step.caption}</span>
              <p className="flow-desc">{step.description}</p>
              {index < ARCHITECTURE_STEPS.length - 1 ? (
                <span className="flow-arrow" aria-hidden="true">
                  <ArrowRightIcon size={15} />
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
