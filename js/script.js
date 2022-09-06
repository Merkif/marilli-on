var lazyLoadInstance = new LazyLoad({});

document.addEventListener('DOMContentLoaded', function() {
  let scrollY;

  //page-height
  function syncHeight() {
    document.documentElement.style.setProperty(
      '--window-inner-height',
      `${window.innerHeight}px`
    );
  }
  syncHeight();
  window.addEventListener('resize', syncHeight);

  //scrollToTop
  document.querySelector(".header__logo").addEventListener('click', function() {
    window.scrollTo(0,0)
  });

  //menu height
  function syncMenuHeight() {
    const menuItemContent = document.querySelectorAll('.menu__list--lvl1 .menu__item-content');
    for (content of menuItemContent) {
      content.closest('.menu__list--lvl1').style.setProperty('--sync-height', `${content.scrollHeight}px`);
    }
  }
  syncMenuHeight();
  window.addEventListener('resize', syncMenuHeight);
  document.addEventListener('DOMSubtreeModified', syncMenuHeight);

  //menu
  const menuButton = document.querySelector('.menu-button');
  const menu = document.querySelector('.menu');

  menuButton.addEventListener('click', () => {
      let expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', !expanded);
      expanded ? menuButton.setAttribute('aria-label', 'Открыть меню') : menuButton.setAttribute('aria-label', 'Закрыть меню');
      menuButton.classList.toggle('menu-button--open');
      menu.classList.toggle('menu--open');

      //dis scroll
      scrollY = window.scrollY;
      document.documentElement.classList.toggle('is-locked');

      if(!document.documentElement.classList.contains('is-locked')) {
        window.scrollTo(0, scrollY);
      }

      //submenu
      let headerMenuControls = menu.querySelectorAll('.menu__mobile-control');

      for (button of headerMenuControls) {
        button.addEventListener('click', function () {
          const header = this.closest('.header');
          let headerMenuDropdown = this.closest('.menu__item--dropdown');
          let headerMenuSubmenuClose = this.closest('.menu--main').querySelector('.menu__submenu-close');
          if (headerMenuDropdown.classList.contains('menu__item--open')) {
            headerMenuDropdown.classList.remove('menu__item--open');
          } else {
            for (el of headerMenuControls) {
              let item = el.closest('.menu__item--dropdown');
              item.classList.remove('menu__item--open');

              document.addEventListener('click', function (evt) {
                const isClickedOutside = !menu.querySelector('.menu__list').contains(evt.target);
                if (isClickedOutside) {
                  header.classList.remove('header--bg');
                  item.classList.remove('menu__item--open');
                  headerMenuSubmenuClose.classList.remove('menu__submenu-close--active');
                }
              });
            }
            header.classList.add('header--bg');
            headerMenuDropdown.classList.add('menu__item--open');
            headerMenuSubmenuClose.classList.add('menu__submenu-close--active');
          }
        })
      }    
  });

  //header height
  const headerHeightSync = () => {
    let headerHeight = document?.querySelector('.header');
    document.querySelector(':root').style.setProperty('--header-height', `${headerHeight.offsetHeight}px`);
  }
  headerHeightSync()
  window.addEventListener('resize', function() {
    headerHeightSync()
  });


  //lang dropdown
  const languageDropdowns = document?.querySelectorAll('.language-dropdown__control');
  languageDropdowns.forEach(el => {

    el.addEventListener('click', function (e) {
      el.closest('.language-dropdown').classList.toggle('language-dropdown--open');
    })
    document.addEventListener('click', function (e) {
      const isClickedOutside = !el.closest('.language-dropdown').contains(e.target);
      if (isClickedOutside) {
        el.closest('.language-dropdown').classList.remove('language-dropdown--open');
      }
    });
  });

  //modals
  const myModal = new HystModal({
    linkAttributeName: "data-hystmodal",
  });

  //visit modal
  const modalNotice = new HystModal({
    linkAttributeName: 'data-hystmodal',
    afterClose: function (modal) {
      localStorage.setItem('visited', true);
    },
  });

  if (localStorage) {
    if (!localStorage.getItem('visited')) {
      modalNotice.open('#modal-notice');
    } else {
      modalNotice.close('#modal-notice');
    }
  } else {
    modalNotice.open('#modal-notice');
  }

  //tabs
  if (document.querySelector('.tabbed')) {
    (function () {
      const tabbed = document.querySelector('.tabbed');
      const tablist = tabbed.querySelector('ul');
      const tabs = tablist.querySelectorAll('a');
      const panels = tabbed.querySelectorAll('[id^="section"]');

      const switchTab = (oldTab, newTab) => {
        newTab.focus();
        newTab.removeAttribute('tabindex');
        newTab.setAttribute('aria-selected', 'true');
        oldTab.removeAttribute('aria-selected');
        oldTab.setAttribute('tabindex', '-1');
        let index = Array.prototype.indexOf.call(tabs, newTab);
        let oldIndex = Array.prototype.indexOf.call(tabs, oldTab);
        panels[oldIndex].hidden = true;
        panels[index].hidden = false;
      }

      tablist.setAttribute('role', 'tablist');

      Array.prototype.forEach.call(tabs, (tab, i) => {
        tab.setAttribute('role', 'tab');
        tab.setAttribute('id', 'tab' + (i + 1));
        tab.setAttribute('tabindex', '-1');
        tab.parentNode.setAttribute('role', 'presentation');

        tab.addEventListener('click', e => {
          e.preventDefault();
          let currentTab = tablist.querySelector('[aria-selected]');
          if (e.currentTarget !== currentTab) {
            switchTab(currentTab, e.currentTarget);
          }
        });

        tab.addEventListener('keydown', e => {
          let index = Array.prototype.indexOf.call(tabs, e.currentTarget);
          let dir = e.which === 38 ? index - 1 : e.which === 40 ? index + 1 : e.which === 39 ? 'down' : null;
          if (dir !== null) {
            e.preventDefault();
            dir === 'down' ? panels[i].focus() : tabs[dir] ? switchTab(e.currentTarget, tabs[dir]) : void 0;
          }
        });
      });

      Array.prototype.forEach.call(panels, (panel, i) => {
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('tabindex', '-1');
        let id = panel.getAttribute('id');
        panel.setAttribute('aria-labelledby', tabs[i].id);
        panel.hidden = true;
      });

      tabs[0].removeAttribute('tabindex');
      tabs[0].setAttribute('aria-selected', 'true');
      panels[0].hidden = false;
    })();
  }


  //cookie
  let cookieClose = document.querySelectorAll('[data-cookie-close]');

  cookieClose.forEach(close => {
    close.addEventListener('click', function() {
      this.closest('.cookie').hidden = true;
    });
  });
});