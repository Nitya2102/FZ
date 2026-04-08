export interface Subject {
  id: string;
  name: string;
  icon: string;
  category: 'electronics' | 'telecom' | 'core';
}

export const defaultSubjects: Subject[] = [
  { id: 'signals', name: 'Signals & Systems', icon: '〰️', category: 'electronics' },
  { id: 'analog', name: 'Analog Circuits', icon: '⚡', category: 'electronics' },
  { id: 'digital', name: 'Digital Electronics', icon: '🔲', category: 'electronics' },
  { id: 'microprocessor', name: 'Microprocessors', icon: '🔧', category: 'electronics' },
  { id: 'vlsi', name: 'VLSI Design', icon: '💠', category: 'electronics' },
  { id: 'emft', name: 'EM Field Theory', icon: '🌊', category: 'telecom' },
  { id: 'commsys', name: 'Communication Systems', icon: '📡', category: 'telecom' },
  { id: 'dsp', name: 'Digital Signal Processing', icon: '📊', category: 'telecom' },
  { id: 'antenna', name: 'Antenna & Propagation', icon: '📶', category: 'telecom' },
  { id: 'networks', name: 'Network Theory', icon: '🔗', category: 'core' },
  { id: 'control', name: 'Control Systems', icon: '🎯', category: 'core' },
  { id: 'maths', name: 'Engineering Maths', icon: '∑', category: 'core' },
];
