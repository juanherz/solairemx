// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  sales: getIcon('ic_ecommerce'), // Make sure you have an icon named 'ic_sales.svg'
};

const navConfig = (role) => {
  const config = [
    // // GENERAL
    // // ----------------------------------------------------------------------
    // {
    //   subheader: 'general',
    //   items: [
    //     { title: 'app', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
    //     { title: 'commerce', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.ecommerce },
    //     { title: 'analytics', path: PATH_DASHBOARD.general.analytics, icon: ICONS.analytics },
    //     { title: 'banking', path: PATH_DASHBOARD.general.banking, icon: ICONS.banking },
    //     // { title: 'booking', path: PATH_DASHBOARD.general.booking, icon: ICONS.booking },
    //   ],
    // },

    // VENTAS
    // ----------------------------------------------------------------------
    {
      subheader: 'Ventas',
      roles: ['admin', 'user'],
      items: [
        {
          title: 'Lista de Ventas',
          icon: ICONS.banking,
          path: PATH_DASHBOARD.sales.list,
          roles: ['admin', 'user'],
        },
        {
          title: 'Crear Venta',
          icon: ICONS.ecommerce,
          path: PATH_DASHBOARD.sales.new,
          roles: ['admin', 'user'],
        },
      ],
    },

    // MANAGEMENT
    // ----------------------------------------------------------------------
    {
      subheader: 'Administración',
      roles: ['admin'], // Only 'admin' can see this section
      items: [
        // USER
        {
          title: 'Usuarios',
          // path: PATH_DASHBOARD.user.root,
          icon: ICONS.user,
          children: [
            // { title: 'profile', path: PATH_DASHBOARD.user.profile },
            // { title: 'cards', path: PATH_DASHBOARD.user.cards },
            { title: 'Lista Usuarios', path: PATH_DASHBOARD.user.list, roles:['admin'] },
            { title: 'Crear Usuario', path: PATH_DASHBOARD.user.new, roles:['admin'] },
            // { title: 'edit', path: PATH_DASHBOARD.user.demoEdit },
            { title: 'Mi cuenta', path: PATH_DASHBOARD.user.account, roles:['admin'] },
          ],
        },

        // // E-COMMERCE
        // {
        //   title: 'e-commerce',
        //   path: PATH_DASHBOARD.eCommerce.root,
        //   icon: ICONS.cart,
        //   children: [
        //     { title: 'shop', path: PATH_DASHBOARD.eCommerce.shop },
        //     { title: 'product', path: PATH_DASHBOARD.eCommerce.demoView },
        //     { title: 'list', path: PATH_DASHBOARD.eCommerce.list },
        //     { title: 'create', path: PATH_DASHBOARD.eCommerce.new },
        //     { title: 'edit', path: PATH_DASHBOARD.eCommerce.demoEdit },
        //     { title: 'checkout', path: PATH_DASHBOARD.eCommerce.checkout },
        //   ],
        // },

        // // INVOICE
        // {
        //   title: 'invoice',
        //   path: PATH_DASHBOARD.invoice.root,
        //   icon: ICONS.invoice,
        //   children: [
        //     { title: 'list', path: PATH_DASHBOARD.invoice.list },
        //     { title: 'details', path: PATH_DASHBOARD.invoice.demoView },
        //     { title: 'create', path: PATH_DASHBOARD.invoice.new },
        //     { title: 'edit', path: PATH_DASHBOARD.invoice.demoEdit },
        //   ],
        // },

        // // BLOG
        // {
        //   title: 'blog',
        //   path: PATH_DASHBOARD.blog.root,
        //   icon: ICONS.blog,
        //   children: [
        //     { title: 'posts', path: PATH_DASHBOARD.blog.posts },
        //     { title: 'post', path: PATH_DASHBOARD.blog.demoView },
        //     { title: 'create', path: PATH_DASHBOARD.blog.new },
        //   ],
        // },
      ],
    },

    // APP
    // ----------------------------------------------------------------------
    {
      subheader: 'Aplicaciones',
      items: [
        // {
        //   title: 'mail',
        //   path: PATH_DASHBOARD.mail.root,
        //   icon: ICONS.mail,
        //   info: (
        //     <Label variant="outlined" color="error">
        //       +32
        //     </Label>
        //   ),
        // },
        // { title: 'chat', path: PATH_DASHBOARD.chat.root, icon: ICONS.chat },
        { title: 'Calendario', path: PATH_DASHBOARD.calendar, icon: ICONS.calendar },
        { title: 'Tareas', path: PATH_DASHBOARD.kanban, icon: ICONS.kanban },
      ],
    },
  ]; 

  // Filtering based on role
  const filteredConfig = config
    .map((section) => {
      // Check if the section should be visible to the user's role
      if (section.roles && !section.roles.includes(role)) {
        return null; // Exclude section
      }

      // Filter items within each section
      const filteredItems = section.items
        .map((item) => {
          // Check if the item should be visible to the user's role
          if (item.roles && !item.roles.includes(role)) {
            return null; // Exclude item
          }

          // Filter child items if any
          const filteredChildren = item.children
            ? item.children.filter((child) => !child.roles || child.roles.includes(role))
            : [];

          // If the item has children, but none are visible, and the item itself doesn't have a path, exclude it
          if (item.children && filteredChildren.length === 0 && !item.path) {
            return null;
          }

          // If the item has no children and no path, exclude it
          if (!item.children && !item.path) {
            return null;
          }

          return {
            ...item,
            children: filteredChildren.length > 0 ? filteredChildren : undefined,
          };
        })
        .filter((item) => item !== null);

      // If no items are left in the section after filtering, exclude the section
      if (filteredItems.length === 0) {
        return null;
      }

      return {
        ...section,
        items: filteredItems,
      };
    })
    .filter((section) => section !== null);

  return filteredConfig;
};
export default navConfig;
