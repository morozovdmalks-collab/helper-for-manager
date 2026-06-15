/*
  Памятка статей расхода — данные дерева решений.

  Важно:
  - В вопросах, вариантах и результатах оставлены только формулировки из блок-схемы Visio.
  - Не меняйте id узлов, если не уверены: на них ссылаются варианты next.
*/

window.DECISION_TREE = {
  title: "Памятка статей расхода",
  version: "1.0",
  startNode: "q-root",
  nodes: {
    "q-root": {
      type: "question",
      question: "СТАТЬЯ для КЛИЕНТА (мы продаем, документ «Заказ Покупателя»), или для ПОСТАВЩИКА (мы покупаем, документ «Заказ Поставщику»)?",
      options: [
        {
          label: "Для КЛИЕНТА (документ «Заказ Покупателя»)",
          next: "q-client-direction",
          icon: "user"
        },
        {
          label: "Для ПОСТАВЩИКА (документ «Заказ Поставщику»)",
          next: "q-supplier-buy",
          icon: "supplier"
        }
      ]
    },

    "q-client-direction": {
      type: "question",
      question: "ОТДЕЛ ПРОДАЖ или АВТОМАТИЗАЦИЯ?",
      options: [
        {
          label: "Отдел продаж",
          next: "r-manager-name",
          icon: "sales"
        },
        {
          label: "Автоматизация",
          next: "r-project-name",
          icon: "automation"
        }
      ]
    },

    "q-supplier-buy": {
      type: "question",
      question: "Что закупаем?",
      options: [
        {
          label: "Оборудование, сырье, вещи (сканеры, принтеры, расходка – то, что можно взять в руки) ИЛИ программное обеспечение (ПО)",
          next: "q-equipment-user",
          icon: "box"
        },
        {
          label: "РАБОТУ или УСЛУГУ",
          next: "q-service-user",
          icon: "service"
        }
      ]
    },

    "q-equipment-user": {
      type: "question",
      question: "КТО в итоге будет это использовать?",
      options: [
        {
          label: "КЛИЕНТ (мы продаем это или используем как сырье в производстве)",
          next: "q-equipment-client-direction",
          icon: "client"
        },
        {
          label: "Мы сами используем (например, стол в офис, вода питьевая или спецодежда, или доп. Место в 1С)",
          next: "q-equipment-internal-direction",
          icon: "team"
        }
      ]
    },

    "q-equipment-client-direction": {
      type: "question",
      question: "Есть ли понимание, под какое направление? ОТДЕЛ ПРОДАЖ или АВТОМАТИЗАЦИЯ?",
      options: [
        {
          label: "Отдел продаж",
          next: "r-2-1-sales-supplier",
          icon: "sales"
        },
        {
          label: "Автоматизация",
          next: "r-3-1-automation-supplier",
          icon: "automation"
        },
        {
          label: "Непонятно/просто на склад (например, расходка)",
          next: "r-2-1-sales-supplier",
          icon: "warehouse"
        }
      ]
    },

    "q-equipment-internal-direction": {
      type: "question",
      question: "Есть ли понимание, под какое направление? ОТДЕЛ ПРОДАЖ или АВТОМАТИЗАЦИЯ?",
      options: [
        {
          label: "Отдел продаж",
          next: "r-2-5-sales-other",
          icon: "sales"
        },
        {
          label: "Автоматизация",
          next: "r-3-6-automation-other",
          icon: "automation"
        },
        {
          label: "Автоматизация - Конструкторский отдел",
          next: "r-3-4-automation-rd",
          icon: "constructor"
        },
        {
          label: "Непонятно/для всех",
          next: "r-1-2-office-maintenance",
          icon: "office"
        }
      ]
    },

    "q-service-user": {
      type: "question",
      question: "КТО в итоге будет это использовать?",
      options: [
        {
          label: "КЛИЕНТ (мы ПЕРЕПРОДАЕМ в 1С эту услугу)",
          next: "q-service-client-direction",
          icon: "client"
        },
        {
          label: "Мы сами используем и платим за это",
          next: "q-service-internal-direction",
          icon: "team"
        }
      ]
    },

    "q-service-client-direction": {
      type: "question",
      question: "К какому направлению относится данный заказ Клиента?",
      options: [
        {
          label: "Отдел продаж",
          next: "r-2-5-sales-other",
          icon: "sales"
        },
        {
          label: "Автоматизация",
          next: "r-project-name",
          icon: "automation"
        }
      ]
    },

    "q-service-internal-direction": {
      type: "question",
      question: "Есть ли четкое понимание направления для этого расхода?",
      options: [
        {
          label: "Отдел продаж",
          next: "q-sales-service-kind",
          icon: "sales"
        },
        {
          label: "Автоматизация",
          next: "q-automation-service-kind",
          icon: "automation"
        },
        {
          label: "Непонятно/для всех",
          next: "q-general-service-kind",
          icon: "office"
        }
      ]
    },

    "q-sales-service-kind": {
      type: "question",
      question: "Какой вид работы или услуги?",
      options: [
        {
          label: "Транспортные расходы",
          next: "q-sales-transport-direction",
          icon: "truck"
        },
        {
          label: "Поиск персонала",
          next: "r-2-6-sales-recruiting",
          icon: "people"
        },
        {
          label: "Тендеры – оплата за участие",
          next: "r-2-3-sales-tenders",
          icon: "doc"
        },
        {
          label: "Реклама и маркетинг",
          next: "r-2-2-sales-marketing",
          icon: "megaphone"
        },
        {
          label: "Прочее (новое/нельзя отнести к иным видам)",
          next: "r-2-5-sales-other",
          icon: "dots"
        }
      ]
    },

    "q-sales-transport-direction": {
      type: "question",
      question: "Доставка откуда-куда?",
      options: [
        {
          label: "От Поставщика - к нам",
          next: "r-2-4-sales-transport",
          icon: "inbound"
        },
        {
          label: "От нас – к Клиенту",
          next: "r-2-4-sales-transport",
          icon: "outbound"
        }
      ]
    },

    "q-automation-service-kind": {
      type: "question",
      question: "Какой вид работы или услуги?",
      options: [
        {
          label: "Транспортные расходы",
          next: "q-automation-transport-direction",
          icon: "truck"
        },
        {
          label: "Командировки (билеты, гостиницы)",
          next: "q-automation-trip-place",
          icon: "plane"
        },
        {
          label: "Реклама и маркетинг",
          next: "r-3-3-automation-marketing",
          icon: "megaphone"
        },
        {
          label: "Поиск персонала",
          next: "r-3-7-automation-recruiting",
          icon: "people"
        },
        {
          label: "Прочее (новое/нельзя отнести к иным видам)",
          next: "r-3-6-automation-other",
          icon: "dots"
        }
      ]
    },

    "q-automation-transport-direction": {
      type: "question",
      question: "Доставка откуда-куда?",
      options: [
        {
          label: "От Поставщика - к нам",
          next: "r-3-5-automation-transport",
          icon: "inbound"
        },
        {
          label: "От нас – к Клиенту",
          next: "r-project-name",
          icon: "outbound"
        }
      ]
    },

    "q-automation-trip-place": {
      type: "question",
      question: "Командировка на ПЛОЩАДКУ или в офис?",
      options: [
        {
          label: "На площадку",
          next: "r-project-name",
          icon: "location"
        },
        {
          label: "В офис (офисная работа для иногородних сотрудников)",
          next: "r-3-9-automation-office-trips",
          icon: "office"
        },
        {
          label: "Не получается разнести (счет - общей суммой)",
          next: "r-3-2-automation-trips",
          icon: "split"
        }
      ]
    },

    "q-general-service-kind": {
      type: "question",
      question: "Какой вид работы или услуги?",
      options: [
        {
          label: "Аренда",
          next: "r-1-1-rent",
          icon: "building"
        },
        {
          label: "Обслуживание офиса (интернет, электричество, уборка/1С и прочее)",
          next: "r-1-2-office-maintenance",
          icon: "office"
        },
        {
          label: "Обучение",
          next: "r-1-7-training",
          icon: "study"
        },
        {
          label: "Поиск персонала (общие сотрудники, относящиеся к УК)",
          next: "r-1-4-general-recruiting",
          icon: "people"
        },
        {
          label: "Корпоративные радости (цветы, корпоратив, напитки и прочее)",
          next: "r-1-11-corporate",
          icon: "spark"
        },
        {
          label: "Представительские расходы (сладости и подарки поставщикам)",
          next: "r-1-12-representation",
          icon: "gift"
        },
        {
          label: "Прочее (новое/нельзя отнести к иным видам)",
          next: "r-1-8-other",
          icon: "dots"
        },
        {
          label: "Расходы учредителей",
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
      title: "Название проекта (напр., Хлебпром Волоколамск, ЯКАИБН и т.д.)",
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
