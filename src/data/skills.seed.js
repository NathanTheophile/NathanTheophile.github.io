export default [
  {
    "id": "development",
    "accent": "development",
    "icon": "DEV",
    "label": {
      "fr": "Developpement",
      "en": "Development"
    },
    "summary": {
      "fr": "Gameplay, systemes, outils et iteration rapide.",
      "en": "Gameplay, systems, tools and fast iteration."
    },
    "description": {
      "fr": "Le coeur code du portfolio : tout ce qui transforme une idee en boucle jouable, lisible et maintenable.",
      "en": "The code core of the portfolio: everything that turns an idea into a playable, readable and maintainable loop."
    },
    "origin": {
      "x": 8,
      "y": 54
    },
    "connections": [
      {
        "from": "development-node-2",
        "to": "development-node",
        "kind": "branch"
      },
      {
        "from": "development-node-3",
        "to": "development-node",
        "kind": "branch"
      },
      {
        "from": "development-node-4",
        "to": "development-node-5",
        "kind": "branch"
      },
      {
        "from": "development-node-2",
        "to": "development-node-6",
        "kind": "branch"
      },
      {
        "from": "development-node-2",
        "to": "development-node-7",
        "kind": "branch"
      },
      {
        "from": "development-node-2",
        "to": "development-node-8",
        "kind": "branch"
      },
      {
        "from": "development-node",
        "to": "development-node-7",
        "kind": "branch"
      },
      {
        "from": "development-node",
        "to": "development-node-9",
        "kind": "branch"
      },
      {
        "from": "development-node-3",
        "to": "development-node-9",
        "kind": "branch"
      },
      {
        "from": "development-node-8",
        "to": "development-node-11",
        "kind": "branch"
      },
      {
        "from": "development-node-8",
        "to": "development-node-12",
        "kind": "branch"
      },
      {
        "from": "development-node-7",
        "to": "development-node-13",
        "kind": "branch"
      },
      {
        "from": "development-node-7",
        "to": "development-node-14",
        "kind": "branch"
      },
      {
        "from": "development-node-15",
        "to": "development-node-2",
        "kind": "branch"
      }
    ],
    "nodes": [
      {
        "id": "development-node",
        "icon": "ND",
        "iconImage": "",
        "shape": "support",
        "size": "large",
        "title": {
          "fr": "C#",
          "en": "C#"
        },
        "summary": {
          "fr": "C#",
          "en": "C#"
        },
        "details": {
          "fr": "Detaille ce node ici.",
          "en": "Describe this node here."
        },
        "tooltipMedia": "",
        "tier": "Support",
        "position": {
          "x": 30,
          "y": 38
        }
      },
      {
        "id": "development-node-2",
        "icon": "ND",
        "iconImage": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzzT9Va5IsVOdKqxsqOscJd7z4q8-tTm_ASg&s.png",
        "shape": "diamond",
        "size": "large",
        "title": {
          "fr": "Unity",
          "en": "UNITY"
        },
        "summary": {
          "fr": "Unity",
          "en": "Game engine for 3D and 2D development"
        },
        "details": {
          "fr": "Detaille ce node ici.",
          "en": "Describe this node here."
        },
        "tooltipMedia": "",
        "tier": "Engine",
        "position": {
          "x": 20,
          "y": 18
        }
      },
      {
        "id": "development-node-3",
        "icon": "ND",
        "iconImage": "https://imgur.com/CplfA1Y.png",
        "shape": "diamond",
        "size": "large",
        "title": {
          "fr": "Godot",
          "en": "Godot"
        },
        "summary": {
          "fr": "Godot",
          "en": "Godot"
        },
        "details": {
          "fr": "Detaille ce node ici.",
          "en": "Describe this node here."
        },
        "tooltipMedia": "",
        "tier": "Support",
        "position": {
          "x": 40,
          "y": 18
        }
      },
      {
        "id": "development-node-4",
        "icon": "ND",
        "iconImage": "https://imgur.com/csNbC42.png",
        "shape": "diamond",
        "size": "large",
        "title": {
          "fr": "Unreal",
          "en": "Unreal"
        },
        "summary": {
          "fr": "Unreal",
          "en": "Unreal"
        },
        "details": {
          "fr": "Detaille ce node ici.",
          "en": "Describe this node here."
        },
        "tooltipMedia": "",
        "tier": "Support",
        "position": {
          "x": 60,
          "y": 18
        }
      },
      {
        "id": "development-node-5",
        "icon": "ND",
        "iconImage": "",
        "shape": "support",
        "size": "large",
        "title": {
          "fr": "Blueprint",
          "en": "Blueprint"
        },
        "summary": {
          "fr": "Blueprint",
          "en": "Blueprint"
        },
        "details": {
          "fr": "Detaille ce node ici.",
          "en": "Describe this node here."
        },
        "tooltipMedia": "",
        "tier": "Support",
        "position": {
          "x": 60,
          "y": 38
        }
      },
      {
        "id": "development-node-6",
        "icon": "ND",
        "iconImage": "",
        "shape": "support",
        "size": "medium",
        "title": {
          "fr": "Network",
          "en": "Network"
        },
        "summary": {
          "fr": "Network",
          "en": "Network"
        },
        "details": {
          "fr": "Detaille ce node ici.",
          "en": "Describe this node here."
        },
        "tooltipMedia": "",
        "tier": "Support",
        "position": {
          "x": 8,
          "y": 26
        }
      },
      {
        "id": "development-node-7",
        "icon": "ND",
        "iconImage": "",
        "shape": "support",
        "size": "large",
        "title": {
          "fr": "Physics",
          "en": "Physics"
        },
        "summary": {
          "fr": "Physics",
          "en": "Physics"
        },
        "details": {
          "fr": "Detaille ce node ici.",
          "en": "Describe this node here."
        },
        "tooltipMedia": "",
        "tier": "Support",
        "position": {
          "x": 24,
          "y": 58
        }
      },
      {
        "id": "development-node-8",
        "icon": "ND",
        "iconImage": "",
        "shape": "support",
        "size": "large",
        "title": {
          "fr": "Animation",
          "en": "Animation"
        },
        "summary": {
          "fr": "Animation",
          "en": "Animation"
        },
        "details": {
          "fr": "Detaille ce node ici.",
          "en": "Describe this node here."
        },
        "tooltipMedia": "",
        "tier": "Support",
        "position": {
          "x": 16,
          "y": 58
        }
      },
      {
        "id": "development-node-9",
        "icon": "ND",
        "iconImage": "",
        "shape": "support",
        "size": "medium",
        "title": {
          "fr": "2D Physics",
          "en": "2D Physics"
        },
        "summary": {
          "fr": "2D Physics",
          "en": "2D Physics"
        },
        "details": {
          "fr": "Detaille ce node ici.",
          "en": "Describe this node here."
        },
        "tooltipMedia": "",
        "tier": "Support",
        "position": {
          "x": 36,
          "y": 58
        }
      },
      {
        "id": "development-node-10",
        "icon": "ND",
        "iconImage": "",
        "shape": "diamond",
        "size": "large",
        "title": {
          "fr": ".NET",
          "en": ".NET"
        },
        "summary": {
          "fr": ".NET",
          "en": ".NET"
        },
        "details": {
          "fr": "Detaille ce node ici.",
          "en": "Describe this node here."
        },
        "tooltipMedia": "",
        "tier": "Support",
        "position": {
          "x": 78,
          "y": 18
        }
      },
      {
        "id": "development-node-11",
        "icon": "ND",
        "iconImage": "",
        "shape": "support",
        "size": "medium",
        "title": {
          "fr": "Tweening",
          "en": "Tweening"
        },
        "summary": {
          "fr": "Tweening",
          "en": "Tweening"
        },
        "details": {
          "fr": "Detaille ce node ici.",
          "en": "Describe this node here."
        },
        "tooltipMedia": "",
        "tier": "Support",
        "position": {
          "x": 8,
          "y": 72
        }
      },
      {
        "id": "development-node-12",
        "icon": "ND",
        "iconImage": "",
        "shape": "support",
        "size": "medium",
        "title": {
          "fr": "Animator",
          "en": "Animator"
        },
        "summary": {
          "fr": "Animator",
          "en": "Animator"
        },
        "details": {
          "fr": "Detaille ce node ici.",
          "en": "Describe this node here."
        },
        "tooltipMedia": "",
        "tier": "Support",
        "position": {
          "x": 10,
          "y": 84
        }
      },
      {
        "id": "development-node-13",
        "icon": "ND",
        "iconImage": "",
        "shape": "support",
        "size": "medium",
        "title": {
          "fr": "Engine Physics",
          "en": "Engine Physics"
        },
        "summary": {
          "fr": "Engine Physics",
          "en": "Engine Physics"
        },
        "details": {
          "fr": "Detaille ce node ici.",
          "en": "Describe this node here."
        },
        "tooltipMedia": "",
        "tier": "Support",
        "position": {
          "x": 20,
          "y": 82
        }
      },
      {
        "id": "development-node-14",
        "icon": "ND",
        "iconImage": "",
        "shape": "support",
        "size": "medium",
        "title": {
          "fr": "3D Maths",
          "en": "3D Maths"
        },
        "summary": {
          "fr": "3D Maths",
          "en": "3D Maths"
        },
        "details": {
          "fr": "Detaille ce node ici.",
          "en": "Describe this node here."
        },
        "tooltipMedia": "",
        "tier": "Support",
        "position": {
          "x": 28,
          "y": 82
        }
      },
      {
        "id": "development-node-15",
        "icon": "ND",
        "iconImage": "",
        "shape": "support",
        "size": "medium",
        "title": {
          "fr": "Shaders",
          "en": "Shaders"
        },
        "summary": {
          "fr": "Shaders",
          "en": "Shaders"
        },
        "details": {
          "fr": "Detaille ce node ici.",
          "en": "Describe this node here."
        },
        "tooltipMedia": "",
        "tier": "Support",
        "position": {
          "x": 14,
          "y": 32
        }
      }
    ]
  },
  {
    "id": "art",
    "accent": "art",
    "icon": "ART",
    "label": {
      "fr": "Art",
      "en": "Art"
    },
    "summary": {
      "fr": "Lisibilite, motion et coherence de presentation.",
      "en": "Readability, motion and presentation coherence."
    },
    "description": {
      "fr": "Un versant technique et sensible : donner une forme juste aux systemes pour qu ils soient clairs, desirables et memorables.",
      "en": "A technical and sensitive side: giving systems the right form so they feel clear, desirable and memorable."
    },
    "origin": {
      "x": 8,
      "y": 54
    },
    "connections": [
      {
        "from": "origin",
        "to": "ui-ux",
        "kind": "major"
      },
      {
        "from": "ui-ux",
        "to": "technical-art",
        "kind": "major"
      },
      {
        "from": "ui-ux",
        "to": "visual-cohesion",
        "kind": "major"
      },
      {
        "from": "technical-art",
        "to": "motion-language",
        "kind": "major"
      },
      {
        "from": "technical-art",
        "to": "composition",
        "kind": "branch"
      },
      {
        "from": "technical-art",
        "to": "visual-cohesion",
        "kind": "branch"
      },
      {
        "from": "motion-language",
        "to": "composition",
        "kind": "branch"
      },
      {
        "from": "visual-cohesion",
        "to": "composition",
        "kind": "branch"
      }
    ],
    "nodes": [
      {
        "id": "ui-ux",
        "icon": "UI",
        "iconImage": "",
        "shape": "core",
        "size": "large",
        "title": {
          "fr": "UI / UX",
          "en": "UI / UX"
        },
        "summary": {
          "fr": "Faire lire sans surcharger.",
          "en": "Make things readable without overload."
        },
        "details": {
          "fr": "Je traite l interface comme une couche de mise en scene. L objectif n est pas juste d afficher une information, mais de la faire comprendre au bon rythme.",
          "en": "I treat interface as a staging layer. The goal is not only to display information, but to make it understood at the right pace."
        },
        "tooltipMedia": "",
        "tier": "Core",
        "position": {
          "x": 22,
          "y": 54
        }
      },
      {
        "id": "technical-art",
        "icon": "TA",
        "iconImage": "",
        "shape": "diamond",
        "size": "medium",
        "title": {
          "fr": "Technical Art",
          "en": "Technical Art"
        },
        "summary": {
          "fr": "Pont entre art, code et contraintes.",
          "en": "Bridge between art, code and constraints."
        },
        "details": {
          "fr": "Shaders, presentation, VFX sobres ou automatisation de setup : j aime les zones ou le craft visuel aide directement la production.",
          "en": "Shaders, presentation, subtle VFX or setup automation: I enjoy the areas where visual craft directly helps production."
        },
        "tooltipMedia": "",
        "tier": "Advanced",
        "position": {
          "x": 40,
          "y": 34
        }
      },
      {
        "id": "motion-language",
        "icon": "MO",
        "iconImage": "",
        "shape": "diamond",
        "size": "medium",
        "title": {
          "fr": "Motion Language",
          "en": "Motion Language"
        },
        "summary": {
          "fr": "Le mouvement comme hierarchie.",
          "en": "Movement as hierarchy."
        },
        "details": {
          "fr": "Quand une transition ou une animation clarifie un etat, une priorite ou un changement de focus, elle fait partie du systeme de lecture.",
          "en": "When a transition or animation clarifies a state, a priority or a focus shift, it becomes part of the readability system."
        },
        "tooltipMedia": "",
        "tier": "Advanced",
        "position": {
          "x": 58,
          "y": 24
        }
      },
      {
        "id": "composition",
        "icon": "CP",
        "iconImage": "",
        "shape": "support",
        "size": "small",
        "title": {
          "fr": "Composition",
          "en": "Composition"
        },
        "summary": {
          "fr": "Cadres, silences et focus.",
          "en": "Frames, silence and focus."
        },
        "details": {
          "fr": "J aime composer les pages et les ecrans comme des posters jouables : une idee dominante, des respirations nettes, et peu de bruit decoratif.",
          "en": "I like composing pages and screens like playable posters: one dominant idea, crisp breathing room and very little decorative noise."
        },
        "tooltipMedia": "",
        "tier": "Support",
        "position": {
          "x": 82,
          "y": 48
        }
      },
      {
        "id": "visual-cohesion",
        "icon": "VC",
        "iconImage": "",
        "shape": "support",
        "size": "small",
        "title": {
          "fr": "Visual Cohesion",
          "en": "Visual Cohesion"
        },
        "summary": {
          "fr": "Une palette qui raconte le systeme.",
          "en": "A palette that tells the system."
        },
        "details": {
          "fr": "Je relie volontiers couleur, materiau et comportement interactif pour qu un projet garde une voix claire meme quand il grandit.",
          "en": "I like connecting color, material and interaction behavior so a project keeps a clear voice even as it grows."
        },
        "tooltipMedia": "",
        "tier": "Support",
        "position": {
          "x": 48,
          "y": 78
        }
      }
    ]
  },
  {
    "id": "creativity",
    "accent": "creativity",
    "icon": "CRE",
    "label": {
      "fr": "Creativite",
      "en": "Creativity"
    },
    "summary": {
      "fr": "Piliers, promesses et direction d experience.",
      "en": "Pillars, promises and experience direction."
    },
    "description": {
      "fr": "La partie qui donne du sens a l ensemble : clarifier ce qu un projet veut faire ressentir, et comment il va le prouver rapidement.",
      "en": "The layer that gives meaning to the whole: clarifying what a project wants players to feel and how it will prove it quickly."
    },
    "origin": {
      "x": 8,
      "y": 54
    },
    "connections": [
      {
        "from": "origin",
        "to": "game-feel-vision",
        "kind": "major"
      },
      {
        "from": "game-feel-vision",
        "to": "creative-pillars",
        "kind": "major"
      },
      {
        "from": "game-feel-vision",
        "to": "cross-discipline",
        "kind": "major"
      },
      {
        "from": "creative-pillars",
        "to": "narrative-framing",
        "kind": "major"
      },
      {
        "from": "creative-pillars",
        "to": "pitch-craft",
        "kind": "branch"
      },
      {
        "from": "creative-pillars",
        "to": "cross-discipline",
        "kind": "branch"
      },
      {
        "from": "narrative-framing",
        "to": "pitch-craft",
        "kind": "branch"
      },
      {
        "from": "cross-discipline",
        "to": "pitch-craft",
        "kind": "branch"
      }
    ],
    "nodes": [
      {
        "id": "game-feel-vision",
        "icon": "GF",
        "iconImage": "",
        "shape": "core",
        "size": "large",
        "title": {
          "fr": "Game Feel Vision",
          "en": "Game Feel Vision"
        },
        "summary": {
          "fr": "Nommer le ressenti avant de le coder.",
          "en": "Name the feel before coding it."
        },
        "details": {
          "fr": "Je cherche a definir tres tot la texture d une action ou d une boucle pour que la technique serve une sensation deja claire.",
          "en": "I try to define the texture of an action or loop very early so the technical work serves an already clear sensation."
        },
        "tooltipMedia": "",
        "tier": "Core",
        "position": {
          "x": 22,
          "y": 54
        }
      },
      {
        "id": "creative-pillars",
        "icon": "PL",
        "iconImage": "",
        "shape": "diamond",
        "size": "medium",
        "title": {
          "fr": "Creative Pillars",
          "en": "Creative Pillars"
        },
        "summary": {
          "fr": "Une promesse courte mais solide.",
          "en": "A short but solid promise."
        },
        "details": {
          "fr": "J aime formaliser quelques piliers forts pour aligner design, production et communication. Cela aide a dire non tout aussi bien qu a dire oui.",
          "en": "I like formalizing a few strong pillars to align design, production and communication. It helps saying no just as much as yes."
        },
        "tooltipMedia": "",
        "tier": "Advanced",
        "position": {
          "x": 40,
          "y": 34
        }
      },
      {
        "id": "narrative-framing",
        "icon": "NF",
        "iconImage": "",
        "shape": "diamond",
        "size": "medium",
        "title": {
          "fr": "Narrative Framing",
          "en": "Narrative Framing"
        },
        "summary": {
          "fr": "Donner du contexte sans perdre le rythme.",
          "en": "Add context without losing pace."
        },
        "details": {
          "fr": "Meme sur des prototypes systemiques, j aime que l intention soit contextualisee : ton, enjeu, situation et desir de joueur doivent se lire tres vite.",
          "en": "Even on systemic prototypes, I like intent to be contextualized: tone, stakes, situation and player desire should read very quickly."
        },
        "tooltipMedia": "",
        "tier": "Advanced",
        "position": {
          "x": 58,
          "y": 24
        }
      },
      {
        "id": "pitch-craft",
        "icon": "PT",
        "iconImage": "",
        "shape": "support",
        "size": "small",
        "title": {
          "fr": "Pitch Craft",
          "en": "Pitch Craft"
        },
        "summary": {
          "fr": "Faire exister l idee en quelques minutes.",
          "en": "Make an idea real in a few minutes."
        },
        "details": {
          "fr": "Je prends au serieux la facon de montrer un prototype. Un bon pitch n est pas de la decoration : c est une clarification du produit.",
          "en": "I take prototype presentation seriously. A good pitch is not decoration: it is a clarification of the product."
        },
        "tooltipMedia": "",
        "tier": "Support",
        "position": {
          "x": 82,
          "y": 48
        }
      },
      {
        "id": "cross-discipline",
        "icon": "XD",
        "iconImage": "",
        "shape": "support",
        "size": "small",
        "title": {
          "fr": "Cross-discipline",
          "en": "Cross-discipline"
        },
        "summary": {
          "fr": "Relier code, design et presentation.",
          "en": "Connect code, design and presentation."
        },
        "details": {
          "fr": "J aime les zones ou plusieurs metiers se rencontrent. C est souvent la que naissent les solutions les plus propres et les plus ambitieuses.",
          "en": "I enjoy the zones where multiple disciplines meet. That is often where the cleanest and most ambitious solutions emerge."
        },
        "tooltipMedia": "",
        "tier": "Support",
        "position": {
          "x": 52,
          "y": 78
        }
      }
    ]
  }
];
