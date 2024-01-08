const cheerio = require("cheerio");
const he = require('he');


const text = `le="presentation">
            <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
            <button aria-label="English (English) selected" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                language-selector__link--selected" data-tracking-control-name="language-selector-en_US" data-locale="en_US" role="menuitem" lang="en_US">
                <strong>English (English)</strong>
            </button>
          </li>
          <li class="language-selector__item" role="presentation">
            <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
            <button aria-label="Español (Spanish)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                language-selector__link !font-regular" data-tracking-control-name="language-selector-es_ES" data-locale="es_ES" role="menuitem" lang="es_ES">
                Español (Spanish)
            </button>
          </li>
          <li class="language-selector__item" role="presentation">
            <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
            <button aria-label="Français (French)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                language-selector__link !font-regular" data-tracking-control-name="language-selector-fr_FR" data-locale="fr_FR" role="menuitem" lang="fr_FR">
                Français (French)
            </button>
          </li>
          <li class="language-selector__item" role="presentation">
            <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
            <button aria-label="हिंदी (Hindi)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                language-selector__link !font-regular" data-tracking-control-name="language-selector-hi_IN" data-locale="hi_IN" role="menuitem" lang="hi_IN">
                हिंदी (Hindi)
            </button>
          </li>
          <li class="language-selector__item" role="presentation">
            <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
            <button aria-label="Bahasa Indonesia (Indonesian)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                language-selector__link !font-regular" data-tracking-control-name="language-selector-in_ID" data-locale="in_ID" role="menuitem" lang="in_ID">
                Bahasa Indonesia (Indonesian)
            </button>
          </li>
          <li class="language-selector__item" role="presentation">
            <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
            <button aria-label="Italiano (Italian)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                language-selector__link !font-regular" data-tracking-control-name="language-selector-it_IT" data-locale="it_IT" role="menuitem" lang="it_IT">
                Italiano (Italian)
            </button>
          </li>
          <li class="language-selector__item" role="presentation">
            <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
            <button aria-label="日本語 (Japanese)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                language-selector__link !font-regular" data-tracking-control-name="language-selector-ja_JP" data-locale="ja_JP" role="menuitem" lang="ja_JP">
                日本語 (Japanese)
            </button>
          </li>
          <li class="language-selector__item" role="presentation">
            <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
            <button aria-label="한국어 (Korean)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                language-selector__link !font-regular" data-tracking-control-name="language-selector-ko_KR" data-locale="ko_KR" role="menuitem" lang="ko_KR">
                한국어 (Korean)
            </button>
          </li>
          <li class="language-selector__item" role="presentation">
            <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
            <button aria-label="Bahasa Malaysia (Malay)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                language-selector__link !font-regular" data-tracking-control-name="language-selector-ms_MY" data-locale="ms_MY" role="menuitem" lang="ms_MY">
                Bahasa Malaysia (Malay)
            </button>
          </li>
          <li class="language-selector__item" role="presentation">
            <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
            <button aria-label="Nederlands (Dutch)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                language-selector__link !font-regular" data-tracking-control-name="language-selector-nl_NL" data-locale="nl_NL" role="menuitem" lang="nl_NL">
                Nederlands (Dutch)
            </button>
          </li>
          <li class="language-selector__item" role="presentation">
            <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
            <button aria-label="Norsk (Norwegian)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                language-selector__link !font-regular" data-tracking-control-name="language-selector-no_NO" data-locale="no_NO" role="menuitem" lang="no_NO">
                Norsk (Norwegian)
            </button>
          </li>
          <li class="language-selector__item" role="presentation">
            <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
            <button aria-label="Polski (Polish)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                language-selector__link !font-regular" data-tracking-control-name="language-selector-pl_PL" data-locale="pl_PL" role="menuitem" lang="pl_PL">
                Polski (Polish)
            </button>
          </li>
          <li class="language-selector__item" role="presentation">
            <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
            <button aria-label="Português (Portuguese)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                language-selector__link !font-regular" data-tracking-control-name="language-selector-pt_BR" data-locale="pt_BR" role="menuitem" lang="pt_BR">
                Português (Portuguese)
            </button>
          </li>
          <li class="language-selector__item" role="presentation">
            <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
            <button aria-label="Română (Romanian)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                language-selector__link !font-regular" data-tracking-control-name="language-selector-ro_RO" data-locale="ro_RO" role="menuitem" lang="ro_RO">
                Română (Romanian)
            </button>
          </li>
          <li class="language-selector__item" role="presentation">
            <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
            <button aria-label="Русский (Russian)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                language-selector__link !font-regular" data-tracking-control-name="language-selector-ru_RU" data-locale="ru_RU" role="menuitem" lang="ru_RU">
                Русский (Russian)
            </button>
          </li>
          <li class="language-selector__item" role="presentation">
            <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
            <button aria-label="Svenska (Swedish)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                language-selector__link !font-regular" data-tracking-control-name="language-selector-sv_SE" data-locale="sv_SE" role="menuitem" lang="sv_SE">
                Svenska (Swedish)
            </button>
          </li>
          <li class="language-selector__item" role="presentation">
            <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
            <button aria-label="ภาษาไทย (Thai)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                language-selector__link !font-regular" data-tracking-control-name="language-selector-th_TH" data-locale="th_TH" role="menuitem" lang="th_TH">
                ภาษาไทย (Thai)
            </button>
          </li>
          <li class="language-selector__item" role="presentation">
            <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
            <button aria-label="Tagalog (Tagalog)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                language-selector__link !font-regular" data-tracking-control-name="language-selector-tl_PH" data-locale="tl_PH" role="menuitem" lang="tl_PH">
                Tagalog (Tagalog)
            </button>
          </li>
          <li class="language-selector__item" role="presentation">
            <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
            <button aria-label="Türkçe (Turkish)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                language-selector__link !font-regular" data-tracking-control-name="language-selector-tr_TR" data-locale="tr_TR" role="menuitem" lang="tr_TR">
                Türkçe (Turkish)
            </button>
          </li>
          <li class="language-selector__item" role="presentation">
            <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
            <button aria-label="Українська (Ukrainian)" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                language-selector__link !font-regular" data-tracking-control-name="language-selector-uk_UA" data-locale="uk_UA" role="menuitem" lang="uk_UA">
                Українська (Ukrainian)
            </button>
          </li>
          <li class="language-selector__item" role="presentation">
            <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
            <button aria-label="简体中文 (Chinese (Simplified))" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                language-selector__link !font-regular" data-tracking-control-name="language-selector-zh_CN" data-locale="zh_CN" role="menuitem" lang="zh_CN">
                简体中文 (Chinese (Simplified))
            </button>
          </li>
          <li class="language-selector__item" role="presentation">
            <!-- Adding aria-label to both the li and the button because screen reader focus goes to button on desktop and li on mobile-->
            <button aria-label="正體中文 (Chinese (Traditional))" class="font-sans text-xs link block py-[5px] px-2 w-full hover:cursor-pointer hover:bg-color-action hover:text-color-text-on-dark focus:bg-color-action focus:text-color-text-on-dark
                language-selector__link !font-regular" data-tracking-control-name="language-selector-zh_TW" data-locale="zh_TW" role="menuitem" lang="zh_TW">
                正體中文 (Chinese (Traditional))
            </button>
          </li>
<!---->      
        </ul>

          
        <button class="language-selector__button select-none relative pr-2 font-sans text-xs font-bold text-color-text-low-emphasis hover:text-color-link-hover hover:cursor-pointer focus:text-color-link-focus focus:outline-dotted focus:outline-1" aria-expanded="false" data-tracking-control-name="footer-lang-dropdown_trigger">
          <span class="language-selector__label-text mr-0.5 break-words">
            Language
          </span>
          <icon class="language-selector__label-chevron w-2 h-2 absolute top-0 right-0" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/cyolgscd0imw2ldqppkrb84vo"></icon>
        </button>
      
    </div>
  
  
          
  </li>

      </ul>

<!---->    </footer>
  
  
  

        
    
    
    
    

    
    
    
    
    <form class="google-auth" action="https://www.linkedin.com/uas/login-submit" method="post">
      <input name="loginCsrfParam" value="0b4f013a-bda2-46b4-880a-3f64b78c2354" type="hidden">

        <input name="session_redirect" value="https://www.linkedin.com/company/thunkable" type="hidden">

      <input name="trk" value="organization_guest_google-one-tap-submit" type="hidden">
        <code id="termsAndConditionsRendered" style="display: none"><!--true--></code>
          <div class="google-one-tap__module hidden fixed flex flex-col items-center top-[20px] right-[20px] z-[9999]">
            <div class="relative top-2 bg-color-background-container-tint pl-2 pr-1 pt-2 pb-3 w-[375px] rounded-md shadow-2xl">
              <p class="text-md font-bold text-color-text">
                Agree & Join LinkedIn
              </p>
              <p class="text-sm text-color-text" data-impression-id="organization_guest_one-tap-skip-tc-text">
                By clicking Continue, you agree to LinkedIn’s <a href="/legal/user-agreement?trk=organization_guest_google-auth-button_user-agreement" target="_blank" data-tracking-control-name="organization_guest_google-auth-button_user-agreement" data-tracking-will-navigate="true">User Agreement</a>, <a href="/legal/privacy-policy?trk=organization_guest_google-auth-button_privacy-policy" target="_blank" data-tracking-control-name="organization_guest_google-auth-button_privacy-policy" data-tracking-will-navigate="true">Privacy Policy</a>, and <a href="/legal/cookie-policy?trk=organization_guest_google-auth-button_cookie-policy" target="_blank" data-tracking-control-name="organization_guest_google-auth-button_cookie-policy" data-tracking-will-navigate="true">Cookie Policy</a>.
              </p>
            </div>
            <div data-tracking-control-name="organization_guest_google-one-tap" id="google-one-tap__container"></div>
          </div>
      
    <div class="loader loader--full-screen">
      <div class="loader__container mb-2 overflow-hidden">
        <icon class="loader__icon inline-block loader__icon--default text-color-progress-loading" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/ddi43qwelxeqjxdd45pe3fvs1" data-svg-class-name="loader__icon-svg--large fill-currentColor h-[60px] min-h-[60px] w-[60px] min-w-[60px]"></icon>
      </div>
    </div>
  
    </form>

    <script data-delayed-url="https://static.licdn.com/aero-v1/sc/h/8m736dfzskmdn6bwwqz67iiki" data-module-id="google-gsi-lib"></script>
    <code id="googleAuthLibraryPath" style="display: none"><!--"https://static.licdn.com/aero-v1/sc/h/8m736dfzskmdn6bwwqz67iiki"--></code>
    <code id="isLinkedInAppWebView" style="display: none"><!--false--></code>
    <code id="isTermsAndConditionsSkipEnabledOneTap" style="display: none"><!--true--></code>
  

    
    
    
    
    
    

    
    
    
    
    
    

      <div class="contextual-sign-in-modal" data-impression-id="organization_guest_contextual-sign-in-modal" data-cool-off-enabled>
<!---->
        

    
    <div class>
<!---->
      <div id="organization_guest_contextual-sign-in" class="modal modal--contextual-sign-in" data-outlet="organization_guest_contextual-sign-in">
<!---->        <div class="modal__overlay flex items-center bg-color-background-scrim justify-center fixed bottom-0 left-0 right-0 top-0 opacity-0 invisible pointer-events-none z-[1000] transition-[opacity] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] duration-[0.17s]
            py-4
            ">
          <section aria-modal="true" role="dialog" aria-labelledby="organization_guest_contextual-sign-in-modal-header" tabindex="-1" class="max-h-full modal__wrapper overflow-auto p-0 bg-color-surface max-w-[1128px] min-h-[160px] relative scale-[0.25] shadow-sm shadow-color-border-faint transition-[transform] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] duration-[0.33s] focus:outline-0
              
              w-[1128px] mamabear:w-[744px] babybear:w-[360px]
              
              rounded-md">
              
              <button class="modal__dismiss btn-tertiary h-[40px] w-[40px] p-0 rounded-full indent-0
                  contextual-sign-in-modal__modal-dismiss absolute right-0 m-[20px] cursor-pointer" aria-label="Dismiss" data-tracking-control-name="organization_guest_contextual-sign-in-modal_modal_dismiss">
                <icon class="contextual-sign-in-modal__modal-dismiss-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/gs508lg3t2o81tq7pmcgn6m2"></icon>
              </button>
          
            <div class="modal__main w-full ">
              
            <div class="contextual-sign-in-modal__screen contextual-sign-in-modal__context-screen flex flex-col my-4 mx-3">
                
                
      <img class="inline-block relative
          
          w-16 h-16
           contextual-sign-in-modal__img m-auto" data-delayed-url="https://media.licdn.com/dms/image/C560BAQEB0-J24ZkmFg/company-logo_200_200/0/1630611256442/thunkable_logo?e=2147483647&amp;v=beta&amp;t=6SMiNrAuu0PCltvQ8Dhk11WWQhjW1AYNiUuxq9W0Ob8" data-ghost-classes="bg-color-entity-ghost-background" data-ghost-url="https://static.licdn.com/aero-v1/sc/h/cs8pjfgyw96g44ln9r7tct85f" alt>
  
              <h2 class="contextual-sign-in-modal__context-screen-title font-sans text-xl text-color-text my-2 mx-4 text-center" id="organization_guest_contextual-sign-in-modal-header">
                Sign in to see who you already know at Thunkable
              </h2>
<!----><!---->              <div class="contextual-sign-in-modal__btn-container m-auto w-[320px] babybear:w-full">
<!---->                
    
    
    
    

    <div class="sign-in-modal" data-impression-id="organization_guest_contextual-sign-in-modal_sign-in-modal">
        <button class="sign-in-modal__outlet-btn cursor-pointer btn-md btn-primary" data-tracking-control-name="organization_guest_contextual-sign-in-modal_sign-in-modal_outlet-button" data-modal="organization_guest_contextual-sign-in_sign-in-modal">
            Sign in
        </button>

      

    
    <div class>
<!---->
      <div id="organization_guest_contextual-sign-in_sign-in-modal" class="modal modal--sign-in" data-outlet="organization_guest_contextual-sign-in_sign-in-modal">
<!---->        <div class="modal__overlay flex items-center bg-color-background-scrim justify-center fixed bottom-0 left-0 right-0 top-0 opacity-0 invisible pointer-events-none z-[1000] transition-[opacity] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] duration-[0.17s]
            py-4
            ">
          <section aria-modal="true" role="dialog" aria-labelledby="organization_guest_contextual-sign-in_sign-in-modal-modal-header" tabindex="-1" class="max-h-full modal__wrapper overflow-auto p-0 bg-color-surface max-w-[1128px] min-h-[160px] relative scale-[0.25] shadow-sm shadow-color-border-faint transition-[transform] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] duration-[0.33s] focus:outline-0
              
              w-[1128px] mamabear:w-[744px] babybear:w-[360px]
              
              rounded-md">
              
            <button class="modal__dismiss btn-tertiary h-[40px] w-[40px] p-0 rounded-full indent-0 sign-in-modal__dismiss absolute right-0 cursor-pointer m-[20px]" aria-label="Dismiss" data-tracking-control-name="organization_guest_contextual-sign-in-modal_sign-in-modal_dismiss">
              <icon class="sign-in-modal__dismiss-icon" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/gs508lg3t2o81tq7pmcgn6m2"></icon>
            </button>
        
            <div class="modal__main w-full ">
              
          <div class="sign-in-modal__screen flex flex-col py-4 px-3 w-[513px] babybear:w-full">
            <h2 class="sign-in-modal__header font-sans text-display-md text-color-text">
                Welcome back
            </h2>
            
    
    
    
    
    
    
    
    
    
    

    <code id="i18n_sign_in_form_show_text" style="display: none"><!--"Show"--></code>
    <code id="i18n_sign_in_form_show_label" style="display: none"><!--"Show your LinkedIn password"--></code>
    <code id="i18n_sign_in_form_hide_text" style="display: none"><!--"Hide"--></code>
    <code id="i18n_sign_in_form_hide_label" style="display: none"><!--"Hide your LinkedIn password"--></code>

    
    <code id="i18n_username_error_empty" style="display: none"><!--"Please enter an email address or phone number"--></code>
    
    <code id="i18n_username_error_too_long" style="display: none"><!--"Email or phone number must be between 3 to 128 characters"--></code>
    <code id="i18n_username_error_too_short" style="display: none"><!--"Email or phone number must be between 3 to 128 characters"--></code>

    
    <code id="i18n_password_error_empty" style="display: none"><!--"Please enter a password"--></code>
    
    <code id="i18n_password_error_too_short" style="display: none"><!--"The password you provided must have at least 6 characters"--></code>
    
    <code id="i18n_password_error_too_long" style="display: none"><!--"The password you provided must have at most 400 characters"--></code>

    <form data-id="sign-in-form" action="https://www.linkedin.com/uas/login-submit" method="post" novalidate class="mt-1.5 mb-2">
      <input name="loginCsrfParam" value="0b4f013a-bda2-46b4-880a-3f64b78c2354" type="hidden">

      <div class="flex flex-col">
        
    <div class="mt-1.5" data-js-module-id="guest-input">
      <div class="flex flex-col">
        <label class="input-label mb-1" for="organization_guest_contextual-sign-in_sign-in-modal_session_key">
          Email or phone
        </label>
        <div class="text-input flex">
          <input class="text-color-text font-sans text-md outline-0 bg-color-transparent grow" autocomplete="username" id="organization_guest_contextual-sign-in_sign-in-modal_session_key" name="session_key" required type="text">
          
        </div>
      </div>

      <p class="input-helper mt-1.5" for="organization_guest_contextual-sign-in_sign-in-modal_session_key" role="alert" data-js-module-id="guest-input__message"></p>
    </div>
  

        
    <div class="mt-1.5" data-js-module-id="guest-input">
      <div class="flex flex-col">
        <label class="input-label mb-1" for="organization_guest_contextual-sign-in_sign-in-modal_session_password">
          Password
        </label>
        <div class="text-input flex">
          <input class="text-color-text font-sans text-md outline-0 bg-color-transparent grow" autocomplete="current-password" id="organization_guest_contextual-sign-in_sign-in-modal_session_password" name="session_password" required type="password">
          
            <button aria-live="assertive" data-id="sign-in-form__password-visibility-toggle" class="font-sans text-md font-bold text-color-action z-10 ml-[12px] hover:cursor-pointer" aria-label="Show your LinkedIn password" data-tracking-control-name="organization_guest_contextual-sign-in-modal_sign-in-modal_sign-in-password-visibility-toggle-btn" type="button">Show</button>
          
        </div>
      </div>

      <p class="input-helper mt-1.5" for="organization_guest_contextual-sign-in_sign-in-modal_session_password" role="alert" data-js-module-id="guest-input__message"></p>
    </div>
  

        <input name="session_redirect" value="https://www.linkedin.com/company/thunkable" type="hidden">

<!---->      </div>

      <div data-id="sign-in-form__footer" class="flex justify-between
          sign-in-form__footer--full-width">
        <a data-id="sign-in-form__forgot-password" class="font-sans text-md font-bold link leading-regular
            sign-in-form__forgot-password--full-width" href="https://www.linkedin.com/uas/request-password-reset?trk=organization_guest_contextual-sign-in-modal_sign-in-modal_forgot_password" data-tracking-control-name="organization_guest_contextual-sign-in-modal_sign-in-modal_forgot_password" data-tracking-will-navigate>Forgot password?</a>

<!---->
        <input name="trk" value="organization_guest_contextual-sign-in-modal_sign-in-modal_sign-in-submit" type="hidden">
        <button class="btn-md btn-primary flex-shrink-0 cursor-pointer
            sign-in-form__submit-btn--full-width" data-id="sign-in-form__submit-btn" data-tracking-control-name="organization_guest_contextual-sign-in-modal_sign-in-modal_sign-in-submit-btn" data-tracking-litms type="submit">
          Sign in
        </button>
      </div>
        <div class="sign-in-form__divider left-right-divider pt-2 pb-3">
          <p class="sign-in-form__divider-text font-sans text-sm text-color-text px-2">
            or
          </p>
        </div>
    </form>
      <div class="w-full max-w-[400px] mx-auto">
        
    <div class="google-auth-button">
        
    
      <code id="isTermsAndConditionsSkipEnabledAuthButton" style="display: none"><!--true--></code>
      <p class="google-auth-button__tc text-color-text-low-emphasis text-xs pb-2" data-impression-id="organization_guest_contextual-sign-in-modal_sign-in-modal_button-skip-tc-text">
        By clicking Continue, you agree to LinkedIn’s <a href="/legal/user-agreement?trk=organization_guest_contextual-sign-in-modal_sign-in-modal_google-auth-button_user-agreement" target="_blank" data-tracking-control-name="organization_guest_contextual-sign-in-modal_sign-in-modal_google-auth-button_user-agreement" data-tracking-will-navigate="true">User Agreement</a>, <a href="/legal/privacy-policy?trk=organization_guest_contextual-sign-in-modal_sign-in-modal_google-auth-button_privacy-policy" target="_blank" data-tracking-control-name="organization_guest_contextual-sign-in-modal_sign-in-modal_google-auth-button_privacy-policy" data-tracking-will-navigate="true">Privacy Policy</a>, and <a href="/legal/cookie-policy?trk=organization_guest_contextual-sign-in-modal_sign-in-modal_google-auth-button_cookie-policy" target="_blank" data-tracking-control-name="organization_guest_contextual-sign-in-modal_sign-in-modal_google-auth-button_cookie-policy" data-tracking-will-navigate="true">Cookie Policy</a>.
      </p>
  
      <div class="google-auth-button__placeholder"></div>
    </div>
  
      </div>
<!---->  
              <p class="sign-in-modal__join-now m-auto font-sans text-md text-color-text
                  mt-2">
                New to LinkedIn? <a href="https://www.linkedin.com/signup?session_redirect=https%3A%2F%2Fwww%2Elinkedin%2Ecom%2Fcompany%2Fthunkable&trk=organization_guest_contextual-sign-in-modal_sign-in-modal_join-link" data-tracking-control-name="organization_guest_contextual-sign-in-modal_sign-in-modal_join-link" data-tracking-will-navigate="true" class="sign-in-modal__join-link">Join now</a>
              </p>
          </div>
        
            </div>

<!---->          </section>
        </div>
      </div>
    </div>
  
    </div>
  

                <div class="contextual-sign-in-modal__divider left-right-divider">
                  <p class="contextual-sign-in-modal__divider-text font-sans text-sm text-color-text px-2">
                    or
                  </p>
                </div>
                  <div class="w-full max-w-[400px] mx-auto">
                    
    <div class="google-auth-button">
        
    
      <code id="isTermsAndConditionsSkipEnabledAuthButton" style="display: none"><!--true--></code>
      <p class="google-auth-button__tc text-color-text-low-emphasis text-xs pb-2" data-impression-id="organization_guest_button-skip-tc-text">
        By clicking Continue, you agree to LinkedIn’s <a href="/legal/user-agreement?trk=organization_guest_google-auth-button_user-agreement" target="_blank" data-tracking-control-name="organization_guest_google-auth-button_user-agreement" data-tracking-will-navigate="true">User Agreement</a>, <a href="/legal/privacy-policy?trk=organization_guest_google-auth-button_privacy-policy" target="_blank" data-tracking-control-name="organization_guest_google-auth-button_privacy-policy" data-tracking-will-navigate="true">Privacy Policy</a>, and <a href="/legal/cookie-policy?trk=organization_guest_google-auth-button_cookie-policy" target="_blank" data-tracking-control-name="organization_guest_google-auth-button_cookie-policy" data-tracking-will-navigate="true">Cookie Policy</a>.
      </p>
  
      <div class="google-auth-button__placeholder"></div>
    </div>
  
                  </div>
              </div>
                <p class="contextual-sign-in-modal__join-now m-auto font-sans text-md text-color-text">
                  New to LinkedIn? <a href="https://www.linkedin.com/signup?session_redirect=https%3A%2F%2Fwww%2Elinkedin%2Ecom%2Fcompany%2Fthunkable&trk=organization_guest_contextual-sign-in-modal_join-link" data-tracking-control-name="organization_guest_contextual-sign-in-modal_join-link" data-tracking-will-navigate="true" class="contextual-sign-in-modal__join-link">Join now</a>
                </p>
            </div>
          
            </div>

<!---->          </section>
        </div>
      </div>
    </div>
  
      </div>
  

        
    
    
    

    
    

    <div class="banner flex w-full justify-center max-h-[500px] text-lg font-normal transition-[max-height,visibility] duration-moderate ease-decelerate
        bg-color-background-brand-accent-3
        
         fixed bottom-0 sticky-cta-banner z-3" data-is-bottom="true" data-impression-id="organization_guest_banner">
      <div class="banner__content flex flex-1 max-w-screen-content-max-w p-2 relative">
            
        <div class="flex w-full justify-between gap-1 babybear:flex-col papamamabear:items-center">
          <div class="text-md font-semibold babybear:text-sm">
            Join to see who you already know at Thunkable
          </div>
          <div class="flex gap-1">
            <a href="https://www.linkedin.com/signup?session_redirect=https%3A%2F%2Fwww%2Elinkedin%2Ecom%2Fcompany%2Fthunkable&amp;trk=organization_guest_sticky-cta-join" class="btn-sm btn-secondary w-16 babybear:w-50%" data-tracking-will-navigate data-tracking-control-name="organization_guest_sticky-cta-join">Join now</a>
            <a href="https://www.linkedin.com/login?session_redirect=https%3A%2F%2Fwww%2Elinkedin%2Ecom%2Fcompany%2Fthunkable&amp;fromSignIn=true&amp;trk=organization_guest_sticky-cta-login" class="btn-sm btn-primary w-16 babybear:w-50%" data-tracking-will-navigate data-tracking-control-name="organization_guest_sticky-cta-login">Sign in</a>
          </div>
        </div>
      
      </div>
<!---->    </div>
  
  
      
        
      <code id="flagshipOrganizationTracking" style="display: none"><!--{"organization":{"objectUrn":"urn:li:organization:10426104"},"module":"COMPANY_OVERVIEW_PAGE","viewerUrn":0}--></code>
  
      

<!---->
            <script src="https://static.licdn.com/aero-v1/sc/h/b19orns4yhthzphzlegb2ykzv" async></script>
<!---->          
        <script src="https://static.licdn.com/aero-v1/sc/h/9dsooiofugxje2tgnk1660ni6" async defer></script>
        <script data-delayed-url="https://static.licdn.com/aero-v1/sc/h/x653ibish526iwzldlzoj0nr" data-module-id="media-player"></script>
      
      </body>
    </html>`;



const $ = cheerio.load(text);

const commentContent = $('code#flagshipOrganizationTracking').html();

// Decode HTML entities using 'he'
const decodedContent = he.decode(commentContent);

// Extract the JSON content inside the comment
const jsonMatch = decodedContent.match(/<!--(.+?)-->/);

if (jsonMatch && jsonMatch[1]) {
  try {
    // Parse the JSON inside the comment
    const jsonContent = JSON.parse(jsonMatch[1]);
    
    // Extract the company ID
    const companyId = jsonContent.organization.objectUrn.split(':').pop();

    console.log('Company ID:', companyId);
  } catch (error) {
    console.error('Error parsing JSON:', error.message);
  }
} else {
  console.log('No JSON content found inside the comment.');
}