import type { DefaultTranslationsObject, Language } from '../types.js'

export const plTranslations: DefaultTranslationsObject = {
  authentication: {
    account: 'Konto',
    accountOfCurrentUser: 'Konto bieżącego użytkownika',
    accountVerified: 'Konto zweryfikowane pomyślnie.',
    alreadyActivated: 'Już aktywowano',
    alreadyLoggedIn: 'Już zalogowano',
    apiKey: 'Klucz API',
    authenticated: 'Uwierzytelniony',
    backToLogin: 'Powrót do logowania',
    beginCreateFirstUser: 'Aby rozpocząć, utwórz pierwszego użytkownika',
    changePassword: 'Zmień hasło',
    checkYourEmailForPasswordReset:
      'Jeśli adres e-mail jest powiązany z kontem, wkrótce otrzymasz instrukcje dotyczące zresetowania hasła. Sprawdź folder ze spamem lub niechcianą pocztą, jeśli nie widzisz e-maila w swojej skrzynce odbiorczej.',
    confirmGeneration: 'Potwierdź wygenerowanie',
    confirmPassword: 'Potwierdź hasło',
    createFirstUser: 'Utwórz pierwszego użytkownika',
    emailNotValid: 'Podany email jest nieprawidłowy',
    emailOrUsername: 'Email lub Nazwa użytkownika',
    emailSent: 'Wysłano email',
    emailVerified: 'Email zweryfikowany pomyślnie.',
    enableAPIKey: 'Aktywuj klucz API',
    failedToUnlock: 'Nie udało się odblokować',
    forceUnlock: 'Wymuś odblokowanie',
    forgotPassword: 'Zresetuj hasło',
    forgotPasswordEmailInstructions:
      'Proszę podaj swój email. Otrzymasz wiadomość z instrukcjami, jak zresetować hasło.',
    forgotPasswordQuestion: 'Nie pamiętasz hasła?',
    forgotPasswordUsernameInstructions:
      'Proszę wpisać poniżej swoją nazwę użytkownika. Instrukcje dotyczące resetowania hasła zostaną wysłane na adres e-mail powiązany z Twoją nazwą użytkownika.',
    generate: 'Wygeneruj',
    generateNewAPIKey: 'Wygeneruj nowy klucz API',
    generatingNewAPIKeyWillInvalidate:
      'Wygenerowanie nowego klucza API <1>unieważni</1> poprzedni klucz. Czy na pewno chcesz kontynuować?',
    lockUntil: 'Zablokuj do',
    logBackIn: 'Zaloguj się ponownie',
    loggedIn: 'Aby zalogować się na inne konto, najpierw się <0>wyloguj</0>.',
    loggedInChangePassword:
      'Aby zmienić hasło, przejdź do swojego <0>konta</0> i tam edytuj swoje hasło.',
    loggedOutInactivity: 'Zostałeś wylogowany z powodu braku aktywności.',
    loggedOutSuccessfully: 'Zostałeś pomyślnie wylogowany.',
    loggingOut: 'Wylogowywanie...',
    login: 'Zaloguj',
    loginAttempts: 'Próby logowania',
    loginUser: 'Zaloguj użytkownika',
    loginWithAnotherUser: 'Aby zalogować się na inne konto, najpierw się <0>wyloguj</0>.',
    logOut: 'Wyloguj',
    logout: 'Wyloguj',
    logoutSuccessful: 'Wylogowanie powiodło się.',
    logoutUser: 'Wyloguj użytkownika',
    newAccountCreated:
      'Właśnie utworzono nowe konto, w celu uzyskania dostępu do <a href="{{serverURL}}">{{serverURL}}</a>. Kliknij poniższy link lub wklej go do przeglądarki, aby zweryfikować swój adres email: <a href="{{verificationURL}}">{{verificationURL}}</a>.<br> Po zweryfikowaniu adresu email będziesz mógł się pomyślnie zalogować.',
    newAPIKeyGenerated: 'Wygenerowano nowy klucz API.',
    newPassword: 'Nowe hasło',
    passed: 'Uwierzytelnienie zakończone sukcesem',
    passwordResetSuccessfully: 'Hasło zostało pomyślnie zresetowane.',
    resetPassword: 'Zresetuj hasło',
    resetPasswordExpiration: 'Zresetuj czas wygaśnięcia hasła',
    resetPasswordToken: 'Zresetuj token hasła',
    resetYourPassword: 'Zresetuj swoje hasło',
    stayLoggedIn: 'Pozostań zalogowany',
    successfullyRegisteredFirstUser: 'Pomyślnie zarejestrowano pierwszego użytkownika.',
    successfullyUnlocked: 'Pomyślnie odblokowano',
    tokenRefreshSuccessful: 'Odświeżenie tokenu powiodło się.',
    unableToVerify: 'Nie można zweryfikować',
    username: 'Nazwa użytkownika',
    usernameNotValid: 'Podana nazwa użytkownika nie jest prawidłowa.',
    verified: 'Zweryfikowano',
    verifiedSuccessfully: 'Pomyślnie zweryfikowany',
    verify: 'Zweryfikuj',
    verifyUser: 'Zweryfikuj użytkownika',
    verifyYourEmail: 'Zweryfikuj swój email',
    youAreInactive:
      'Nie byłeś aktywny od dłuższego czasu i wkrótce zostaniesz automatycznie wylogowany dla własnego bezpieczeństwa. Czy chcesz pozostać zalogowany?',
    youAreReceivingResetPassword:
      'Otrzymałeś tę wiadomość, ponieważ Ty (lub ktoś inny) poprosiłeś o zresetowanie hasła do Twojego konta. Kliknij poniższy link lub wklej go w przeglądarce, aby zakończyć proces:',
    youDidNotRequestPassword:
      'Jeśli nie prosiłeś o zmianę hasła, zignoruj tę wiadomość, a Twoje hasło pozostanie niezmienione.',
  },
  error: {
    accountAlreadyActivated: 'To konto zostało już aktywowane.',
    autosaving: 'Wystąpił problem podczas automatycznego zapisywania tego dokumentu.',
    correctInvalidFields: 'Popraw nieprawidłowe pola.',
    deletingFile: '',
    deletingTitle:
      'Wystąpił błąd podczas usuwania {{title}}. Proszę, sprawdź swoje połączenie i spróbuj ponownie.',
    documentNotFound:
      'Dokument o ID {{id}} nie mógł zostać znaleziony. Mogło zostać usunięte lub nigdy nie istniało, lub może nie masz do niego dostępu.',
    emailOrPasswordIncorrect: 'Podany adres e-mail lub hasło jest nieprawidłowe.',
    followingFieldsInvalid_one: 'To pole jest nieprawidłowe:',
    followingFieldsInvalid_other: 'Następujące pola są nieprawidłowe:',
    incorrectCollection: 'Nieprawidłowa kolekcja',
    insufficientClipboardPermissions: 'Odmowa dostępu do schowka. Sprawdź uprawnienia schowka.',
    invalidClipboardData: 'Nieprawidłowe dane schowka.',
    invalidFileType: 'Nieprawidłowy typ pliku',
    invalidFileTypeValue: 'Nieprawidłowy typ pliku: {{value}}',
    invalidRequestArgs: 'Nieprawidłowe argumenty w żądaniu: {{args}}',
    loadingDocument: 'Wystapił problem podczas ładowania dokumentu o ID {{id}}.',
    localesNotSaved_one: 'Następującej lokalizacji nie można było zapisać:',
    localesNotSaved_other: 'Następujących lokalizacji nie można było zapisać:',
    logoutFailed: 'Wylogowanie nie powiodło się.',
    missingEmail: 'Brak adresu email.',
    missingIDOfDocument: 'Brak ID dokumentu do aktualizacji.',
    missingIDOfVersion: 'Brak ID wersji',
    missingRequiredData: 'Brak wymaganych danych.',
    noFilesUploaded: 'Nie przesłano żadnych plików.',
    noMatchedField: 'Nie znaleziono pasującego pola dla "{{label}}"',
    notAllowedToAccessPage: 'Nie masz dostępu do tej strony.',
    notAllowedToPerformAction: 'Nie możesz wykonać tej akcji.',
    notFound: 'Żądany zasób nie został znaleziony.',
    noUser: 'Brak użytkownika',
    previewing: 'Wystąpił problem podczas podglądu tego dokumentu.',
    problemUploadingFile: 'Wystąpił problem podczas przesyłania pliku.',
    restoringTitle:
      'Wystąpił błąd podczas przywracania {{title}}. Sprawdź swoje połączenie i spróbuj ponownie.',
    tokenInvalidOrExpired: 'Token jest nieprawidłowy lub wygasł.',
    tokenNotProvided: 'Token nie został dostarczony.',
    unableToCopy: 'Nie można skopiować.',
    unableToDeleteCount: 'Nie można usunąć {{count}} z {{total}} {{label}}.',
    unableToReindexCollection:
      'Błąd podczas ponownego indeksowania kolekcji {{collection}}. Operacja została przerwana.',
    unableToUpdateCount: 'Nie można zaktualizować {{count}} z {{total}} {{label}}.',
    unauthorized: 'Brak dostępu, musisz być zalogowany.',
    unauthorizedAdmin: 'Brak dostępu, ten użytkownik nie ma dostępu do panelu administracyjnego.',
    unknown: 'Wystąpił nieznany błąd.',
    unPublishingDocument: 'Wystąpił problem podczas cofania publikacji tego dokumentu.',
    unspecific: 'Wystąpił błąd',
    unverifiedEmail: 'Proszę zweryfikować swój e-mail przed zalogowaniem się.',
    userEmailAlreadyRegistered: 'Użytkownik o podanym adresie e-mail jest już zarejestrowany.',
    userLocked: 'Ten użytkownik został zablokowany z powodu zbyt wielu nieudanych prób logowania.',
    usernameAlreadyRegistered: 'Użytkownik o podanej nazwie użytkownika jest już zarejestrowany.',
    usernameOrPasswordIncorrect: 'Podana nazwa użytkownika lub hasło jest nieprawidłowe.',
    valueMustBeUnique: 'Wartość musi być unikalna',
    verificationTokenInvalid: 'Token weryfikacyjny jest nieprawidłowy.',
  },
  fields: {
    addLabel: 'Dodaj {{label}}',
    addLink: 'Dodaj Link',
    addNew: 'Dodaj nowy',
    addNewLabel: 'Dodaj nowy {{label}}',
    addRelationship: 'Dodaj Relację',
    addUpload: 'Dodaj ładowanie',
    block: 'Blok',
    blocks: 'Bloki',
    blockType: 'Typ Bloku',
    chooseBetweenCustomTextOrDocument:
      'Wybierz między wprowadzeniem niestandardowego tekstowego adresu URL a linkiem do innego dokumentu.',
    chooseDocumentToLink: 'Wybierz dokument, do którego chcesz utworzyć łącze',
    chooseFromExisting: 'Wybierz z istniejących',
    chooseLabel: 'Wybierz {{label}}',
    collapseAll: 'Zwiń wszystko',
    customURL: 'Niestandardowy adres URL',
    editLabelData: 'Edytuj dane {{label}}',
    editLink: 'Edytuj Link',
    editRelationship: 'Edytuj Relację',
    enterURL: 'Wpisz adres URL',
    internalLink: 'Link wewnętrzny',
    itemsAndMore: '{{items}} i {{count}} więcej',
    labelRelationship: 'Relacja {{label}}',
    latitude: 'Szerokość',
    linkedTo: 'Połączony z <0>{{label}}</0>',
    linkType: 'Typ łącza',
    longitude: 'Długość geograficzna',
    newLabel: 'Nowy {{label}}',
    openInNewTab: 'Otwórz w nowej karcie',
    passwordsDoNotMatch: 'Hasła nie pasują',
    relatedDocument: 'Powiązany dokument',
    relationTo: 'Powiązany z',
    removeRelationship: 'Usuń Relację',
    removeUpload: 'Usuń Wrzucone',
    saveChanges: 'Zapisz zmiany',
    searchForBlock: 'Szukaj bloku',
    selectExistingLabel: 'Wybierz istniejący {{label}}',
    selectFieldsToEdit: 'Wybierz pola do edycji',
    showAll: 'Pokaż wszystkie',
    swapRelationship: 'Zamiana Relacji',
    swapUpload: 'Zamień Wrzucone',
    textToDisplay: 'Tekst do wyświetlenia',
    toggleBlock: 'Przełącz blok',
    uploadNewLabel: 'Wrzuć nowy {{label}}',
  },
  folder: {
    browseByFolder: 'Przeglądaj według folderu',
    byFolder: 'Według Folderu',
    deleteFolder: 'Usuń folder',
    folderName: 'Nazwa folderu',
    folders: 'Foldery',
    folderTypeDescription:
      'Wybierz, które typy dokumentów z kolekcji powinny być dozwolone w tym folderze.',
    itemHasBeenMoved: '{{title}} został przeniesiony do {{folderName}}',
    itemHasBeenMovedToRoot: '{{title}} został przeniesiony do folderu głównego',
    itemsMovedToFolder: '{{title}} przeniesiono do {{folderName}}',
    itemsMovedToRoot: '{{title}} został przeniesiony do folderu głównego',
    moveFolder: 'Przenieś folder',
    moveItemsToFolderConfirmation:
      'Zamierzasz przenieść <1>{{count}} {{label}}</1> do <2>{{toFolder}}</2>. Czy jesteś pewien?',
    moveItemsToRootConfirmation:
      'Zamierzasz przenieść <1>{{count}} {{label}}</1> do folderu głównego. Czy jesteś pewien?',
    moveItemToFolderConfirmation:
      'Zamierzasz przenieść <1>{{title}}</1> do <2>{{toFolder}}</2>. Czy jesteś pewien?',
    moveItemToRootConfirmation:
      'Zamierzasz przenieść <1>{{title}}</1> do folderu głównego. Jesteś pewien?',
    movingFromFolder: 'Przenoszenie {{title}} z {{fromFolder}}',
    newFolder: 'Nowy folder',
    noFolder: 'Brak folderu',
    renameFolder: 'Zmień nazwę folderu',
    searchByNameInFolder: 'Szukaj według nazwy w {{folderName}}',
    selectFolderForItem: 'Wybierz folder dla {{title}}',
  },
  general: {
    name: 'Nazwa',
    aboutToDelete: 'Zamierzasz usunąć {{label}} <1>{{title}}</1>. Jesteś pewien?',
    aboutToDeleteCount_many: 'Zamierzasz usunąć {{count}} {{label}}',
    aboutToDeleteCount_one: 'Zamierzasz usunąć {{count}} {{label}}',
    aboutToDeleteCount_other: 'Zamierzasz usunąć {{count}} {{label}}',
    aboutToPermanentlyDelete:
      'Zamierzasz na stałe usunąć {{label}} <1>{{title}}</1>. Czy jesteś pewien?',
    aboutToPermanentlyDeleteTrash:
      'Zamierzasz na stałe usunąć <0>{{count}}</0> <1>{{label}}</1> z kosza. Czy jesteś pewny?',
    aboutToRestore: 'Zamierzasz przywrócić {{label}} <1>{{title}}</1>. Czy jesteś pewny?',
    aboutToRestoreAsDraft:
      'Zamierzasz przywrócić {{label}} <1>{{title}}</1> jako szkic. Czy jesteś pewien?',
    aboutToRestoreAsDraftCount: 'Za chwilę przywrócisz {{count}} {{label}} jako szkic',
    aboutToRestoreCount: 'Za chwilę przywrócisz {{count}} {{label}}',
    aboutToTrash: 'Zamierzasz przenieść {{label}} <1>{{title}}</1> do kosza. Czy jesteś pewien?',
    aboutToTrashCount: 'Zamierzasz przenieść {{count}} {{label}} do kosza.',
    addBelow: 'Dodaj poniżej',
    addFilter: 'Dodaj filtr',
    adminTheme: 'Motyw administratora',
    all: 'Wszystko',
    allCollections: 'Wszystkie kolekcje',
    allLocales: 'Wszystkie lokalizacje',
    and: 'i',
    anotherUser: 'Inny użytkownik',
    anotherUserTakenOver: 'Inny użytkownik przejął edycję tego dokumentu.',
    applyChanges: 'Zastosuj zmiany',
    ascending: 'Rosnąco',
    automatic: 'Automatyczny',
    backToDashboard: 'Powrót do panelu',
    cancel: 'Anuluj',
    changesNotSaved:
      'Twoje zmiany nie zostały zapisane. Jeśli teraz wyjdziesz, stracisz swoje zmiany.',
    clear: 'Jasne',
    clearAll: 'Wyczyść wszystko',
    close: 'Zamknij',
    collapse: 'Zwiń',
    collections: 'Kolekcje',
    columns: 'Kolumny',
    columnToSort: 'Kolumna sortowania',
    confirm: 'Potwierdź',
    confirmCopy: 'Potwierdź kopię',
    confirmDeletion: 'Potwierdź usunięcie',
    confirmDuplication: 'Potwierdź duplikację',
    confirmMove: 'Potwierdź przeniesienie',
    confirmReindex: 'Ponownie zaindeksować wszystkie {{collections}}?',
    confirmReindexAll: 'Ponownie zaindeksować wszystkie kolekcje?',
    confirmReindexDescription:
      'Spowoduje to usunięcie istniejących indeksów i ponowne zaindeksowanie dokumentów w kolekcjach {{collections}}.',
    confirmReindexDescriptionAll:
      'Spowoduje to usunięcie istniejących indeksów i ponowne zaindeksowanie dokumentów we wszystkich kolekcjach.',
    confirmRestoration: 'Potwierdź przywrócenie',
    copied: 'Skopiowano',
    copy: 'Skopiuj',
    copyField: 'Kopiuj pole',
    copying: 'Kopiowanie',
    copyRow: 'Kopiuj wiersz',
    copyWarning:
      'Zamierzasz nadpisać {{to}} na {{from}} dla {{label}} {{title}}. Czy jesteś pewny?',
    create: 'Stwórz',
    created: 'Utworzono',
    createdAt: 'Data utworzenia',
    createNew: 'Stwórz nowy',
    createNewLabel: 'Stwórz nowy {{label}}',
    creating: 'Tworzenie',
    creatingNewLabel: 'Tworzenie nowego {{label}}',
    currentlyEditing:
      'obecnie edytuje ten dokument. Jeśli przejmiesz kontrolę, zostaną zablokowani przed dalszą edycją i mogą również utracić niezapisane zmiany.',
    custom: 'Niestandardowy',
    dark: 'Ciemny',
    dashboard: 'Panel',
    delete: 'Usuń',
    deleted: 'Usunięte',
    deletedAt: 'Usunięto o',
    deletedCountSuccessfully: 'Pomyślnie usunięto {{count}} {{label}}.',
    deletedSuccessfully: 'Pomyślnie usunięto.',
    deletePermanently: 'Pomiń kosz i usuń na stałe',
    deleting: 'Usuwanie...',
    depth: 'Głębokość',
    descending: 'Malejąco',
    deselectAllRows: 'Odznacz wszystkie wiersze',
    document: 'Dokument',
    documentIsTrashed: 'To {{label}} jest w koszu i jest tylko do odczytu.',
    documentLocked: 'Dokument zablokowany',
    documents: 'Dokumenty',
    duplicate: 'Zduplikuj',
    duplicateWithoutSaving: 'Zduplikuj bez zapisywania zmian',
    edit: 'Edytuj',
    editAll: 'Edytuj wszystko',
    editedSince: 'Edytowano od',
    editing: 'Edycja',
    editingLabel_many: 'Edytowanie {{count}} {{label}}',
    editingLabel_one: 'Edytowanie {{count}} {{label}}',
    editingLabel_other: 'Edytowanie {{count}} {{label}}',
    editingTakenOver: 'Edycja przejęta',
    editLabel: 'Edytuj {{label}}',
    email: 'Email',
    emailAddress: 'Adres email',
    emptyTrash: 'Opróżnij kosz',
    emptyTrashLabel: 'Opróżnij śmieci {{label}}',
    enterAValue: 'Wpisz wartość',
    error: 'Błąd',
    errors: 'Błędy',
    exitLivePreview: 'Wyjdź z Podglądu na Żywo',
    export: 'Eksport',
    fallbackToDefaultLocale: 'Powrót do domyślnych ustawień regionalnych',
    false: 'Fałszywe',
    filter: 'Filtr',
    filters: 'Filtry',
    filterWhere: 'Filtruj gdzie',
    globals: 'Globalne',
    goBack: 'Wróć',
    groupByLabel: 'Grupuj według {{label}}',
    import: 'Import',
    isEditing: 'edytuje',
    item: 'przedmiot',
    items: 'przedmioty',
    language: 'Język',
    lastModified: 'Ostatnio zmodyfikowany',
    leaveAnyway: 'Wyjdź mimo to',
    leaveWithoutSaving: 'Wyjdź bez zapisywania',
    light: 'Jasny',
    livePreview: 'Podgląd',
    loading: 'Ładowanie',
    locale: 'Ustawienia regionalne',
    locales: 'Ustawienia regionalne',
    menu: 'Menu',
    moreOptions: 'Więcej opcji',
    move: 'Przesuń',
    moveConfirm:
      'Zamierzasz przenieść {{count}} {{label}} do <1>{{destination}}</1>. Czy na pewno?',
    moveCount: 'Przenieś {{count}} {{label}}',
    moveDown: 'Przesuń niżej',
    moveUp: 'Przesuń wyżej',
    moving: 'Przeprowadzka',
    movingCount: 'Przenoszenie {{count}} {{label}}',
    newPassword: 'Nowe hasło',
    next: 'Następny',
    no: 'Nie',
    noDateSelected: 'Nie wybrano daty',
    noFiltersSet: 'Brak ustawionych filtrów',
    noLabel: '<Bez {{label}}>',
    none: 'Nic',
    noOptions: 'Brak opcji',
    noResults:
      'Nie znaleziono {{label}}. Być może {{label}} jeszcze nie istnieje, albo żaden nie pasuje do filtrów określonych powyżej.',
    notFound: 'Nie znaleziono',
    nothingFound: 'Nic nie znaleziono',
    noTrashResults: 'Brak {{label}} w koszu.',
    noUpcomingEventsScheduled: 'Nie zaplanowano żadnych nadchodzących wydarzeń.',
    noValue: 'Brak wartości',
    of: 'z',
    only: 'Tylko',
    open: 'Otwórz',
    or: 'lub',
    order: 'Kolejność',
    overwriteExistingData: 'Nadpisz istniejące dane pola',
    pageNotFound: 'Strona nie znaleziona',
    password: 'Hasło',
    pasteField: 'Wklej pole',
    pasteRow: 'Wklej wiersz',
    payloadSettings: 'Ustawienia Payload',
    permanentlyDelete: 'Trwale Usuń',
    permanentlyDeletedCountSuccessfully: 'Trwale usunięto {{count}} {{label}} pomyślnie.',
    perPage: 'Na stronę: {{limit}}',
    previous: 'Poprzedni',
    reindex: 'Ponowne indeksowanie',
    reindexingAll: 'Ponowne indeksowanie wszystkich {{collections}}.',
    remove: 'Usuń',
    rename: 'Zmień nazwę',
    reset: 'Zresetuj',
    resetPreferences: 'Zresetuj preferencje',
    resetPreferencesDescription: 'To zresetuje wszystkie Twoje preferencje do ustawień domyślnych.',
    resettingPreferences: 'Resetowanie preferencji.',
    restore: 'Przywróć',
    restoreAsPublished: 'Przywróć jako opublikowaną wersję',
    restoredCountSuccessfully: 'Pomyślnie przywrócono {{count}} {{label}}.',
    restoring: 'Przywracanie...',
    row: 'Wiersz',
    rows: 'Wiersze',
    save: 'Zapisz',
    saving: 'Zapisywanie...',
    schedulePublishFor: 'Zaplanuj publikację dla {{title}}',
    searchBy: 'Szukaj według',
    select: 'Wybierz',
    selectAll: 'Wybierz wszystkie {{count}} {{label}}',
    selectAllRows: 'Wybierz wszystkie wiersze',
    selectedCount: 'Wybrano {{count}} {{label}}',
    selectLabel: 'Wybierz {{label}}',
    selectValue: 'Wybierz wartość',
    showAllLabel: 'Pokaż wszystkie {{label}}',
    sorryNotFound: 'Przepraszamy — nie ma nic, co odpowiadałoby twojemu zapytaniu.',
    sort: 'Sortuj',
    sortByLabelDirection: 'Sortuj według {{label}} {{direction}}',
    stayOnThisPage: 'Pozostań na stronie',
    submissionSuccessful: 'Zgłoszenie zakończone powodzeniem.',
    submit: 'Zatwierdź',
    submitting: 'Przesyłanie...',
    success: 'Sukces',
    successfullyCreated: 'Pomyślnie utworzono {{label}}.',
    successfullyDuplicated: 'Pomyślnie zduplikowano {{label}}',
    successfullyReindexed:
      'Pomyślnie ponownie zindeksowano {{count}} z {{total}} dokumentów z kolekcji {{collections}}.',
    takeOver: 'Przejąć',
    thisLanguage: 'Polski',
    time: 'Czas',
    timezone: 'Strefa czasowa',
    titleDeleted: 'Pomyślnie usunięto {{label}} {{title}}',
    titleRestored: 'Etykieta "{{title}}" została pomyślnie przywrócona.',
    titleTrashed: '{{label}} "{{title}}" przeniesiony do kosza.',
    trash: 'Śmieci',
    trashedCountSuccessfully: '{{count}} {{label}} przeniesiono do kosza.',
    true: 'Prawda',
    unauthorized: 'Brak autoryzacji',
    unsavedChanges: 'Masz niezapisane zmiany. Zapisz lub odrzuć, zanim kontynuujesz.',
    unsavedChangesDuplicate: 'Masz niezapisane zmiany. Czy chcesz kontynuować duplikowanie?',
    untitled: 'Bez nazwy',
    upcomingEvents: 'Nadchodzące Wydarzenia',
    updatedAt: 'Data edycji',
    updatedCountSuccessfully: 'Pomyślnie zaktualizowano {{count}} {{label}}.',
    updatedLabelSuccessfully: 'Pomyślnie zaktualizowano {{label}}.',
    updatedSuccessfully: 'Aktualizacja zakończona sukcesem.',
    updateForEveryone: 'Aktualizacja dla wszystkich',
    updating: 'Aktualizacja',
    uploading: 'Przesyłanie',
    uploadingBulk: 'Przesyłanie {{current}} z {{total}}',
    user: 'użytkownik',
    username: 'Nazwa użytkownika',
    users: 'użytkownicy',
    value: 'Wartość',
    viewing: 'Podgląd',
    viewReadOnly: 'Widok tylko do odczytu',
    welcome: 'Witaj',
    yes: 'Tak',
  },
  localization: {
    cannotCopySameLocale: 'Nie można skopiować do tego samego miejsca.',
    copyFrom: 'Kopiuj z',
    copyFromTo: 'Kopiowanie z {{from}} do {{to}}',
    copyTo: 'Kopiuj do',
    copyToLocale: 'Kopiuj do lokalizacji',
    localeToPublish: 'Publikować lokalnie',
    selectLocaleToCopy: 'Wybierz lokalizację do skopiowania',
  },
  operators: {
    contains: 'zawiera',
    equals: 'równe',
    exists: 'istnieje',
    intersects: 'przecina się',
    isGreaterThan: 'jest większy niż',
    isGreaterThanOrEqualTo: 'jest większe lub równe',
    isIn: 'jest w',
    isLessThan: 'jest mniejsze niż',
    isLessThanOrEqualTo: 'jest mniejsze lub równe',
    isLike: 'jest jak',
    isNotEqualTo: 'nie jest równe',
    isNotIn: 'nie ma go w',
    isNotLike: 'nie jest jak',
    near: 'blisko',
    within: 'w ciągu',
  },
  upload: {
    addFile: 'Dodaj plik',
    addFiles: 'Dodaj pliki',
    bulkUpload: 'Załaduj masowo',
    crop: 'Przytnij',
    cropToolDescription:
      'Przeciągnij narożniki wybranego obszaru, narysuj nowy obszar lub dostosuj poniższe wartości.',
    download: 'Pobierz',
    dragAndDrop: 'Przeciągnij i upuść plik',
    dragAndDropHere: 'lub złap i upuść plik tutaj',
    editImage: 'Edytuj obraz',
    fileName: 'Nazwa pliku',
    fileSize: 'Rozmiar pliku',
    filesToUpload: 'Pliki do przesłania',
    fileToUpload: 'Plik do przesłania',
    focalPoint: 'Punkt centralny',
    focalPointDescription:
      'Przeciągnij punkt centralny bezpośrednio na podglądzie lub dostosuj wartości poniżej.',
    height: 'Wysokość',
    lessInfo: 'Mniej informacji',
    moreInfo: 'Więcej informacji',
    noFile: 'Brak pliku',
    pasteURL: 'Wklej URL',
    previewSizes: 'Rozmiary podglądu',
    selectCollectionToBrowse: 'Wybierz kolekcję aby przejrzeć',
    selectFile: 'Wybierz plik',
    setCropArea: 'Ustaw obszar kadrowania',
    setFocalPoint: 'Ustawić punkt ogniskowy',
    sizes: 'Rozmiary',
    sizesFor: 'Rozmiary dla {{label}}',
    width: 'Szerokość',
  },
  validation: {
    emailAddress: 'Wprowadź poprawny adres email.',
    enterNumber: 'Wprowadź poprawny numer telefonu.',
    fieldHasNo: 'To pole nie posiada {{label}}',
    greaterThanMax: '{{value}} jest większe niż maksymalnie dozwolony {{label}} wynoszący {{max}}.',
    invalidInput: 'To pole zawiera nieprawidłowe dane.',
    invalidSelection: 'To pole ma nieprawidłowy wybór.',
    invalidSelections: 'To pole zawiera następujące, nieprawidłowe wybory:',
    lessThanMin: '{{value}} jest mniejsze niż minimalnie dozwolony {{label}} wynoszący {{min}}.',
    limitReached: 'Osiągnięto limit, można dodać tylko {{max}} elementów.',
    longerThanMin: 'Ta wartość musi być dłuższa niż minimalna długość znaków: {{minLength}}.',
    notValidDate: '"{{value}}" nie jest prawidłową datą.',
    required: 'To pole jest wymagane.',
    requiresAtLeast: 'To pole wymaga co najmniej {{count}} {{label}}.',
    requiresNoMoreThan: 'To pole może posiadać co najmniej {{count}} {{label}}.',
    requiresTwoNumbers: 'To pole wymaga dwóch liczb.',
    shorterThanMax: 'Ta wartość musi być krótsza niż maksymalna długość znaków: {{maxLength}}.',
    timezoneRequired: 'Wymagana jest strefa czasowa.',
    trueOrFalse: "To pole może mieć wartość tylko 'true' lub 'false'.",
    username:
      'Proszę wprowadzić prawidłową nazwę użytkownika. Może zawierać litery, cyfry, myślniki, kropki i podkreślniki.',
    validUploadID: 'To pole nie jest prawidłowym identyfikatorem przesyłania.',
  },
  version: {
    type: 'Typ',
    aboutToPublishSelection:
      'Za chwilę opublikujesz wszystkie {{label}} w zaznaczeniu. Jesteś pewny?',
    aboutToRestore:
      'Zamierzasz przywrócić dokument {{label}} do stanu, w jakim znajdował się w dniu {{versionDate}}.',
    aboutToRestoreGlobal:
      'Zamierzasz przywrócić globalny rekord {{label}} do stanu, w którym znajdował się w dniu {{versionDate}}.',
    aboutToRevertToPublished:
      'Zamierzasz przywrócić zmiany w tym dokumencie do stanu opublikowanego. Jesteś pewien?',
    aboutToUnpublish: 'Zamierzasz cofnąć publikację tego dokumentu. Jesteś pewien?',
    aboutToUnpublishSelection:
      'Zamierzasz cofnąć publikację wszystkich {{label}} w zaznaczeniu. Jesteś pewny?',
    autosave: 'Autozapis',
    autosavedSuccessfully: 'Pomyślnie zapisano automatycznie.',
    autosavedVersion: 'Wersja zapisana automatycznie',
    changed: 'Zmieniono',
    changedFieldsCount_one: '{{count}} zmienione pole',
    changedFieldsCount_other: '{{count}} zmienione pola',
    compareVersion: 'Porównaj wersję z:',
    compareVersions: 'Porównaj Wersje',
    comparingAgainst: 'Porównując do',
    confirmPublish: 'Potwierdź publikację',
    confirmRevertToSaved: 'Potwierdź powrót do zapisanego',
    confirmUnpublish: 'Potwierdź cofnięcie publikacji',
    confirmVersionRestoration: 'Potwierdź przywrócenie wersji',
    currentDocumentStatus: 'Bieżący status {{docStatus}} dokumentu',
    currentDraft: 'Aktualna wersja robocza',
    currentlyPublished: 'Obecnie opublikowane',
    currentlyViewing: 'Obecnie przeglądasz',
    currentPublishedVersion: 'Aktualna Opublikowana Wersja',
    draft: 'Szkic',
    draftSavedSuccessfully: 'Wersja robocza została pomyślnie zapisana.',
    lastSavedAgo: 'Ostatnio zapisane {{distance}} temu',
    modifiedOnly: 'Tylko zmodyfikowany',
    moreVersions: 'Więcej wersji...',
    noFurtherVersionsFound: 'Nie znaleziono dalszych wersji',
    noRowsFound: 'Nie znaleziono {{label}}',
    noRowsSelected: 'Nie wybrano {{etykieta}}',
    preview: 'Podgląd',
    previouslyDraft: 'Poprzednio Szkic',
    previouslyPublished: 'Wcześniej opublikowane',
    previousVersion: 'Poprzednia Wersja',
    problemRestoringVersion: 'Wystąpił problem podczas przywracania tej wersji',
    publish: 'Publikuj',
    publishAllLocales: 'Opublikuj wszystkie lokalizacje',
    publishChanges: 'Opublikuj zmiany',
    published: 'Opublikowano',
    publishIn: 'Opublikuj w {{locale}}',
    publishing: 'Publikacja',
    restoreAsDraft: 'Przywróć jako szkic',
    restoredSuccessfully: 'Przywrócono pomyślnie.',
    restoreThisVersion: 'Przywróć tę wersję',
    restoring: 'Przywracanie...',
    reverting: 'Cofanie...',
    revertToPublished: 'Przywróć do opublikowanego',
    saveDraft: 'Zapisz szkic',
    scheduledSuccessfully: 'Zaplanowano pomyślnie.',
    schedulePublish: 'Zaplanuj publikację',
    selectLocales: 'Wybierz ustawienia regionalne do wyświetlenia',
    selectVersionToCompare: 'Wybierz wersję do porównania',
    showingVersionsFor: 'Wyświetlanie wersji dla:',
    showLocales: 'Pokaż ustawienia regionalne:',
    specificVersion: 'Konkretna Wersja',
    status: 'Status',
    unpublish: 'Cofnij publikację',
    unpublishing: 'Cofanie publikacji...',
    version: 'Wersja',
    versionAgo: '{{distance}} temu',
    versionCount_many: 'Znalezionych wersji: {{count}}',
    versionCount_none: 'Nie znaleziono wersji',
    versionCount_one: 'Znaleziono {{count}} wersję',
    versionCount_other: 'Znaleziono {{count}} wersji',
    versionCreatedOn: 'Wersja {{version}} utworzona:',
    versionID: 'ID wersji',
    versions: 'Wersje',
    viewingVersion: 'Przeglądanie wersji dla {{entityLabel}} {{documentTitle}}',
    viewingVersionGlobal: 'Przeglądanie wersji dla globalnej kolekcji {{entityLabel}}',
    viewingVersions: 'Przeglądanie wersji {{entityLabel}} {{documentTitle}}',
    viewingVersionsGlobal: 'Przeglądanie wersji dla globalnej kolekcji {{entityLabel}}',
  },
}

export const pl: Language = {
  dateFNSKey: 'pl',
  translations: plTranslations,
}
