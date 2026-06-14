export const MC_QUESTIONS = [
  {
    id: 'mc1',
    question:
      'A student examining a cell under a microscope identifies a structure where DNA is copied into mRNA. Where is this process taking place?',
    choices: [
      'At the ribosome in the cytoplasm',
      'Inside the nucleus',
      'At the cell membrane',
      'In the mitochondria',
    ],
    correctIndex: 1,
    explanation:
      'Transcription — copying DNA into mRNA — occurs inside the nucleus. The mRNA then exits the nucleus to reach ribosomes.',
  },
  {
    id: 'mc2',
    question:
      'Which molecule serves as the messenger that carries genetic instructions from the nucleus to the ribosome?',
    choices: ['DNA', 'tRNA', 'mRNA', 'ATP'],
    correctIndex: 2,
    explanation:
      'Messenger RNA (mRNA) is the copy of a gene that travels from the nucleus to a ribosome, carrying the code for building a protein.',
  },
  {
    id: 'mc3',
    question:
      'The process in which a ribosome reads mRNA and links amino acids together to form a protein is called:',
    choices: ['Transcription', 'Replication', 'Translation', 'Fermentation'],
    correctIndex: 2,
    explanation:
      'Translation occurs at the ribosome, where mRNA codons are read and amino acids are assembled into a polypeptide chain.',
  },
  {
    id: 'mc4',
    question: 'Proteins are biological molecules made of chains of:',
    choices: ['Nucleotides', 'Monosaccharides', 'Amino acids', 'Fatty acids'],
    correctIndex: 2,
    explanation:
      'Proteins are polymers built from amino acid monomers linked by peptide bonds in a specific order determined by mRNA.',
  },
  {
    id: 'mc5',
    question:
      'During transcription, which molecule is used as a template to build a strand of RNA?',
    choices: ['A protein', 'A ribosome', 'A DNA strand', 'An amino acid chain'],
    correctIndex: 2,
    explanation:
      'During transcription, RNA polymerase uses one strand of DNA as a template to synthesize a complementary mRNA molecule.',
  },
]

export const CR_QUESTIONS = [
  {
    id: 'cr1',
    title: 'Blocked mRNA Export',
    scenario:
      'Researchers treat cells with a drug that prevents mRNA from leaving the nucleus. After treatment, the cells produce very little protein compared to untreated cells.',
    prompt:
      'Using Claim-Evidence-Reasoning (CER), explain why protein production decreased in the treated cells.',
    cerHint:
      'Claim: State why protein production dropped. Evidence: Reference the drug blocking mRNA from leaving the nucleus. Reasoning: Connect mRNA\'s role in delivering instructions to ribosomes.',
  },
  {
    id: 'cr2',
    title: 'Codon Reading Data',
    scenario: null,
    dataTable: {
      headers: ['Codon on mRNA', 'Amino Acid Added'],
      rows: [
        ['AUG', 'Methionine (start)'],
        ['GCU', 'Alanine'],
        ['UAA', 'Stop (no amino acid added)'],
      ],
    },
    prompt:
      'A ribosome reads the mRNA sequence AUG → GCU → UAA. Using CER, state how many amino acids will be in the finished protein and explain why.',
    cerHint:
      'Claim: State the number of amino acids. Evidence: Use the codon table — note that UAA is a stop codon. Reasoning: Explain that translation ends at stop codons and no further amino acids are added.',
  },
]
