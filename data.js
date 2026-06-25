/*
  Памятка статей расхода — данные дерева решений.

  Как редактировать:
  1. Тексты вопросов лежат в поле question.
  2. Варианты ответов лежат в массиве options.
  3. Итоговые статьи лежат в узлах type: "result".
  4. В итоговых узлах поле title должно повторять текст из блок-схемы без дополнительных пояснений.
  5. Не меняйте id узлов, если не уверены: на них ссылаются варианты next.
*/

window.DECISION_TREE = {
  title: "Памятка статей расхода",
  version: "1.8",
  startNode: "q-root",
  source: "По схеме Visio: Памятка статей расхода",
  nodes: {
    "q-root": {
      type: "question",
      eyebrow: "Старт",
      question: "Статья для клиента или для поставщика?",
      hint: "Выберите, какой документ оформляется: продажа клиенту или закупка у поставщика.",
      options: [
        {
          label: "Для клиента",
          description: "Мы продаём. Документ: «Заказ Покупателя».",
          next: "q-client-direction",
          icon: "user"
        },
        {
          label: "Для поставщика",
          description: "Мы покупаем. Документ: «Заказ Поставщику».",
          next: "q-supplier-buy",
          icon: "supplier"
        }
      ]
    },

    "q-client-direction": {
      type: "question",
      eyebrow: "Клиент",
      question: "Отдел продаж или автоматизация?",
      hint: "Определите направление клиентского заказа.",
      options: [
        {
          label: "Отдел продаж",
          description: "Клиентский заказ относится к отделу продаж.",
          next: "r-manager-name",
          icon: "sales"
        },
        {
          label: "Автоматизация",
          description: "Клиентский заказ относится к автоматизации / проекту.",
          next: "r-project-name",
          icon: "automation"
        }
      ]
    },

    "q-supplier-buy": {
      type: "question",
      eyebrow: "Поставщик",
      question: "Что закупаем?",
      hint: "Выберите тип закупки: материальные вещи / ПО или работу / услугу.",
      options: [
        {
          label: "Оборудование, сырьё, вещи или ПО",
          description: "Сканеры, принтеры, расходка, предметы, которые можно взять в руки, или программное обеспечение.",
          next: "q-equipment-user",
          icon: "box"
        },
        {
          label: "Работу или услугу",
          description: "Услуга, работа, доставка, маркетинг, командировка, обучение и т.п.",
          next: "q-service-user",
          icon: "service"
        }
      ]
    },

    "q-equipment-user": {
      type: "question",
      eyebrow: "Оборудование / ПО",
      question: "Кто в итоге будет это использовать?",
      hint: "Важно понять: закупка предназначена для клиента или для внутреннего использования.",
      options: [
        {
          label: "Клиент",
          description: "Мы продаём это клиенту или используем как сырьё в производстве.",
          next: "q-equipment-client-direction",
          icon: "client"
        },
        {
          label: "Мы сами используем",
          description: "Например: стол в офис, питьевая вода, спецодежда, дополнительное место в 1С.",
          next: "q-equipment-internal-direction",
          icon: "team"
        }
      ]
    },

    "q-equipment-client-direction": {
      type: "question",
      eyebrow: "Для клиента",
      question: "Есть ли понимание, под какое направление?",
      hint: "Выберите направление: отдел продаж, автоматизация или непонятно / просто на склад.",
      options: [
        {
          label: "Отдел продаж",
          description: "Закупка для клиентского заказа отдела продаж.",
          next: "r-2-1-sales-supplier",
          icon: "sales"
        },
        {
          label: "Автоматизация",
          description: "Закупка для проекта автоматизации.",
          next: "r-3-1-automation-supplier",
          icon: "automation"
        },
        {
          label: "Непонятно / просто на склад",
          description: "Например, расходные материалы без привязки к проекту.",
          next: "r-2-1-sales-supplier",
          icon: "warehouse"
        }
      ]
    },

    "q-equipment-internal-direction": {
      type: "question",
      eyebrow: "Внутреннее использование",
      question: "Есть ли понимание, под какое направление?",
      hint: "Выберите внутреннее направление, для которого закупаются оборудование, вещи или ПО.",
      options: [
        {
          label: "Отдел продаж",
          description: "Внутренние нужды отдела продаж.",
          next: "r-2-5-sales-other",
          icon: "sales"
        },
        {
          label: "Автоматизация",
          description: "Внутренние нужды автоматизации.",
          next: "r-3-6-automation-other",
          icon: "automation"
        },
        {
          label: "Автоматизация — конструкторский отдел",
          description: "ОКР, оснащение, конструкторские задачи.",
          next: "r-3-4-automation-rd",
          icon: "constructor"
        },
        {
          label: "Непонятно / для всех",
          description: "Общая закупка для офиса или нескольких направлений.",
          next: "r-1-2-office-maintenance",
          icon: "office"
        }
      ]
    },

    "q-service-user": {
      type: "question",
      eyebrow: "Работа / услуга",
      question: "Кто в итоге будет это использовать?",
      hint: "Услуга перепродаётся клиенту или нужна нам самим?",
      options: [
        {
          label: "Клиент",
          description: "Мы перепродаём эту услугу в 1С.",
          next: "q-service-client-direction",
          icon: "client"
        },
        {
          label: "Мы сами используем и платим за это",
          description: "Внутренняя услуга или работа для нашей компании.",
          next: "q-service-internal-direction",
          icon: "team"
        }
      ]
    },

    "q-service-client-direction": {
      type: "question",
      eyebrow: "Услуга для клиента",
      question: "К какому направлению относится данный заказ клиента?",
      hint: "Выберите направление клиентского заказа.",
      options: [
        {
          label: "Отдел продаж",
          description: "Клиентский заказ отдела продаж.",
          next: "r-2-5-sales-other",
          icon: "sales"
        },
        {
          label: "Автоматизация",
          description: "Клиентский проект автоматизации.",
          next: "r-project-name",
          icon: "automation"
        }
      ]
    },

    "q-service-internal-direction": {
      type: "question",
      eyebrow: "Внутренняя услуга",
      question: "Есть ли чёткое понимание направления для этого расхода?",
      hint: "Выберите направление, к которому относится расход.",
      options: [
        {
          label: "Отдел продаж",
          description: "Услуга нужна отделу продаж.",
          next: "q-sales-service-kind",
          icon: "sales"
        },
        {
          label: "Автоматизация",
          description: "Услуга нужна автоматизации.",
          next: "q-automation-service-kind",
          icon: "automation"
        },
        {
          label: "Непонятно / для всех",
          description: "Общий расход компании или расход без явной привязки к направлению.",
          next: "q-general-service-kind",
          icon: "office"
        }
      ]
    },

    "q-sales-service-kind": {
      type: "question",
      eyebrow: "Отдел продаж",
      question: "Какой вид работы или услуги?",
      hint: "Выберите наиболее подходящий тип расхода отдела продаж.",
      options: [
        {
          label: "Транспортные расходы",
          description: "Доставка, перемещение, перевозка.",
          next: "q-sales-transport-direction",
          icon: "truck"
        },
        {
          label: "Поиск персонала",
          description: "Кадровые расходы по поиску сотрудников.",
          next: "r-2-6-sales-recruiting",
          icon: "people"
        },
        {
          label: "Тендеры — оплата за участие",
          description: "Расходы на участие в тендерах.",
          next: "r-2-3-sales-tenders",
          icon: "doc"
        },
        {
          label: "Реклама и маркетинг",
          description: "Маркетинговые расходы отдела продаж.",
          next: "r-2-2-sales-marketing",
          icon: "megaphone"
        },
        {
          label: "Прочее",
          description: "Новое или нельзя отнести к другим видам.",
          next: "r-2-5-sales-other",
          icon: "dots"
        }
      ]
    },

    "q-sales-transport-direction": {
      type: "question",
      eyebrow: "Транспортные расходы",
      question: "Доставка откуда-куда?",
      hint: "Для отдела продаж оба варианта ведут к одной статье.",
      options: [
        {
          label: "От поставщика — к нам",
          description: "Доставка от поставщика в нашу компанию.",
          next: "r-2-4-sales-transport",
          icon: "inbound"
        },
        {
          label: "От нас — к клиенту",
          description: "Доставка от нашей компании клиенту.",
          next: "r-manager-name",
          icon: "outbound"
        }
      ]
    },

    "q-automation-service-kind": {
      type: "question",
      eyebrow: "Автоматизация",
      question: "Какой вид работы или услуги?",
      hint: "Выберите наиболее подходящий тип расхода автоматизации.",
      options: [
        {
          label: "Транспортные расходы",
          description: "Доставка, перемещение, перевозка.",
          next: "q-automation-transport-direction",
          icon: "truck"
        },
        {
          label: "Командировки",
          description: "Билеты, гостиницы и другие командировочные расходы.",
          next: "q-automation-trip-place",
          icon: "plane"
        },
        {
          label: "Реклама и маркетинг",
          description: "Маркетинговые расходы автоматизации.",
          next: "r-3-3-automation-marketing",
          icon: "megaphone"
        },
        {
          label: "Поиск персонала",
          description: "Кадровые расходы по поиску сотрудников автоматизации.",
          next: "r-3-7-automation-recruiting",
          icon: "people"
        },
        {
          label: "Прочее",
          description: "Новое или нельзя отнести к другим видам.",
          next: "r-3-6-automation-other",
          icon: "dots"
        }
      ]
    },

    "q-automation-transport-direction": {
      type: "question",
      eyebrow: "Транспортные расходы",
      question: "Доставка откуда-куда?",
      hint: "Для автоматизации статья зависит от направления доставки.",
      options: [
        {
          label: "От поставщика — к нам",
          description: "Доставка от поставщика в нашу компанию.",
          next: "r-3-5-automation-transport",
          icon: "inbound"
        },
        {
          label: "От нас — к клиенту",
          description: "Доставка клиенту в рамках проекта.",
          next: "r-project-name",
          icon: "outbound"
        }
      ]
    },

    "q-automation-trip-place": {
      type: "question",
      eyebrow: "Командировки",
      question: "Командировка на площадку или в офис?",
      hint: "Выберите, куда относится командировка.",
      options: [
        {
          label: "На площадку",
          description: "Командировка на площадку клиента / проекта.",
          next: "r-project-name",
          icon: "location"
        },
        {
          label: "В офис",
          description: "Офисная работа для иногородних сотрудников.",
          next: "r-3-9-automation-office-trips",
          icon: "office"
        },
        {
          label: "Не получается разнести",
          description: "Счёт выставлен общей суммой, без понятной детализации.",
          next: "r-3-2-automation-trips",
          icon: "split"
        }
      ]
    },

    "q-general-service-kind": {
      type: "question",
      eyebrow: "Общие расходы",
      question: "Какой вид работы или услуги?",
      hint: "Выберите тип общего расхода компании.",
      options: [
        {
          label: "Поиск персонала",
          description: "Общие сотрудники, относящиеся к УК.",
          next: "r-1-4-general-recruiting",
          icon: "people"
        },
        {
          label: "Аренда",
          description: "Аренда помещений.",
          next: "r-1-1-rent",
          icon: "building"
        },
        {
          label: "Обслуживание офиса",
          description: "Интернет, электричество, уборка, 1С и прочее.",
          next: "r-1-2-office-maintenance",
          icon: "office"
        },
        {
          label: "Обучение",
          description: "Обучающие мероприятия и материалы.",
          next: "r-1-7-training",
          icon: "study"
        },
        {
          label: "Корпоративные радости",
          description: "Цветы, корпоратив, напитки и прочее.",
          next: "r-1-11-corporate",
          icon: "spark"
        },
        {
          label: "Представительские расходы",
          description: "Сладости и подарки поставщикам.",
          next: "r-1-12-representation",
          icon: "gift"
        },
        {
          label: "Прочее",
          description: "Новое или нельзя отнести к другим видам.",
          next: "r-1-8-other",
          icon: "dots"
        },
        {
          label: "Расходы учредителей",
          description: "В схеме ведёт к статье обеспечения безопасности.",
          next: "r-1-3-security",
          icon: "shield"
        }
      ]
    },

    "r-manager-name": {
      type: "result",
      title: "ФИО менеджера",
      status: "ready"
    },
    "r-project-name": {
      type: "result",
      title: "Название проекта",
      status: "ready"
    },
    "r-2-1-sales-supplier": {
      type: "result",
      title: "2.1. Оплата поставщикам (отдел продаж)",
      status: "ready"
    },
    "r-3-1-automation-supplier": {
      type: "result",
      title: "3.1. Оплата поставщикам (Автоматизация)",
      status: "ready"
    },
    "r-2-5-sales-other": {
      type: "result",
      title: "2.5. Разное (отдел продаж)",
      status: "ready"
    },
    "r-3-6-automation-other": {
      type: "result",
      title: "3.6. Разное (Автоматизация)",
      status: "ready"
    },
    "r-3-4-automation-rd": {
      type: "result",
      title: "3.4. ОКР и оснащение (Автоматизация)",
      status: "ready"
    },
    "r-1-2-office-maintenance": {
      type: "result",
      title: "1.2. Обслуживание офиса",
      status: "ready"
    },
    "r-2-6-sales-recruiting": {
      type: "result",
      title: "2.6. Поиск персонала (кадры) (отдел продаж)",
      status: "ready"
    },
    "r-2-3-sales-tenders": {
      type: "result",
      title: "2.3. Тендеры (отдел продаж)",
      status: "ready"
    },
    "r-2-2-sales-marketing": {
      type: "result",
      title: "2.2. Реклама и маркетинг (отдел продаж)",
      status: "ready"
    },
    "r-2-4-sales-transport": {
      type: "result",
      title: "2.4. Транспортные расходы (отдел продаж)",
      status: "ready"
    },
    "r-3-3-automation-marketing": {
      type: "result",
      title: "3.3. Реклама и маркетинг (Автоматизация)",
      status: "ready"
    },
    "r-3-7-automation-recruiting": {
      type: "result",
      title: "3.7. Поиск персонала (кадры) (Автоматизация)",
      status: "ready"
    },
    "r-3-5-automation-transport": {
      type: "result",
      title: "3.5. Транспортные расходы (Автоматизация)",
      status: "ready"
    },
    "r-3-9-automation-office-trips": {
      type: "result",
      title: "3.9. Командировки офис (Автоматизация)",
      status: "ready"
    },
    "r-3-2-automation-trips": {
      type: "result",
      title: "3.2. Командировки (Автоматизация)",
      status: "ready"
    },
    "r-1-4-general-recruiting": {
      type: "result",
      title: "1.4. Поиск персонала (кадры)",
      status: "ready"
    },
    "r-1-1-rent": {
      type: "result",
      title: "1.1. Аренда помещений",
      status: "ready"
    },
    "r-1-7-training": {
      type: "result",
      title: "1.7. Обучение",
      status: "ready"
    },
    "r-1-11-corporate": {
      type: "result",
      title: "1.11. Корпоративные радости",
      status: "ready"
    },
    "r-1-12-representation": {
      type: "result",
      title: "1.12. Представительские расходы",
      status: "ready"
    },
    "r-1-8-other": {
      type: "result",
      title: "1.8. Разное",
      status: "ready"
    },
    "r-1-3-security": {
      type: "result",
      title: "1.3. Обеспечение безопасности",
      status: "ready"
    }
  }
};
