import { Customer, InventoryItem, NotificationItem, Project, TaskItem } from '../core/models/business.models';

export const projects: Project[] = [
  {id:'RV-2419',name:'Marlow Flagship',clientId:'CL-1001',client:'Marlow Coffee',status:'In progress',due:'Sep 18',dueIso:'2026-09-18',value:18400,progress:68,owner:'Mina Farrow',risk:'Material delivery unconfirmed',scope:'Flagship café fit-out, wayfinding and custom millwork package.'},
  {id:'RV-2417',name:'Lumen Clinic Reception',clientId:'CL-1002',client:'Lumen Health',status:'Review',due:'Sep 21',dueIso:'2026-09-21',value:12900,progress:84,owner:'Jon Bell',risk:'Budget variance reached 8.4%',scope:'Reception refresh, privacy screens, signage and patient-facing finishes.'},
  {id:'RV-2413',name:'North & Pine Retail',clientId:'CL-1003',client:'North & Pine',status:'On hold',due:'Sep 27',dueIso:'2026-09-27',value:9750,progress:42,owner:'Mina Farrow',risk:'Client approval overdue by 2 days',scope:'Retail display system and seasonal merchandising package.'},
  {id:'RV-2408',name:'Aster Office Phase II',clientId:'CL-1004',client:'Aster Labs',status:'In progress',due:'Oct 02',dueIso:'2026-10-02',value:22100,progress:55,owner:'Sam Chen',scope:'Second-floor workplace expansion, meeting rooms and acoustic package.'},
  {id:'RV-2401',name:'Sora Studio Fit-out',clientId:'CL-1005',client:'Sora',status:'Completed',due:'Sep 09',dueIso:'2026-09-09',value:14600,progress:100,owner:'Mina Farrow',scope:'Compact creative studio fit-out with storage wall and lighting upgrade.'},
  {id:'RV-2398',name:'Vale House Showroom',clientId:'CL-1006',client:'Vale House',status:'Review',due:'Oct 08',dueIso:'2026-10-08',value:16800,progress:73,owner:'Jon Bell',scope:'Furniture showroom zoning, sample library and branded consultation suite.'}
];

export const customers: Customer[] = [
  {id:'CL-1001',name:'Marlow Coffee',initials:'MC',contact:'Nora Ellis',email:'nora@marlow.example',phone:'+1 212 555 0184',city:'Brooklyn, NY',activeProjects:2,lifetimeValue:42600,lastActivity:'2 hours ago',status:'Active'},
  {id:'CL-1002',name:'Lumen Health',initials:'LH',contact:'David Kim',email:'david@lumen.example',phone:'+1 646 555 0130',city:'New York, NY',activeProjects:1,lifetimeValue:28400,lastActivity:'Yesterday',status:'Active'},
  {id:'CL-1003',name:'North & Pine',initials:'NP',contact:'Leah Morgan',email:'leah@northpine.example',phone:'+1 917 555 0176',city:'Jersey City, NJ',activeProjects:1,lifetimeValue:19750,lastActivity:'3 days ago',status:'Active'},
  {id:'CL-1004',name:'Aster Labs',initials:'AL',contact:'Owen Hart',email:'owen@aster.example',phone:'+1 718 555 0151',city:'Queens, NY',activeProjects:2,lifetimeValue:71200,lastActivity:'Today',status:'Active'},
  {id:'CL-1005',name:'Sora',initials:'SO',contact:'Emi Watanabe',email:'emi@sora.example',phone:'+1 347 555 0108',city:'Brooklyn, NY',activeProjects:0,lifetimeValue:14600,lastActivity:'Sep 10',status:'Dormant'},
  {id:'CL-1006',name:'Vale House',initials:'VH',contact:'Maya Cole',email:'maya@valehouse.example',phone:'+1 929 555 0147',city:'Manhattan, NY',activeProjects:1,lifetimeValue:16800,lastActivity:'4 hours ago',status:'Active'}
];

export const inventory: InventoryItem[] = [
  {id:'INV-0401',name:'White oak veneer panel',category:'Sheet goods',sku:'SG-OAK-18',supplier:'Hudson Materials',inStock:22,reserved:14,reorderAt:10,unit:'sheets',unitCost:118,status:'Healthy',project:'Marlow Flagship'},
  {id:'INV-0402',name:'Warm grey acoustic felt',category:'Acoustic',sku:'AC-FLT-12',supplier:'Forma Supply',inStock:8,reserved:6,reorderAt:10,unit:'rolls',unitCost:74,status:'Low stock',project:'Aster Office Phase II'},
  {id:'INV-0403',name:'Brushed brass trim 20mm',category:'Metal',sku:'MT-BRS-20',supplier:'Northline Metal',inStock:0,reserved:12,reorderAt:8,unit:'lengths',unitCost:32,status:'Ordered',project:'Lumen Clinic Reception'},
  {id:'INV-0404',name:'Matte black wayfinding vinyl',category:'Signage',sku:'SN-VNL-MB',supplier:'Axis Graphics',inStock:31,reserved:9,reorderAt:12,unit:'meters',unitCost:15,status:'Healthy'},
  {id:'INV-0405',name:'LED linear 3000K',category:'Lighting',sku:'LT-LIN-30',supplier:'Lux Foundry',inStock:5,reserved:5,reorderAt:8,unit:'units',unitCost:96,status:'Low stock',project:'Vale House Showroom'},
  {id:'INV-0406',name:'Clear coat low-VOC',category:'Finishes',sku:'FN-CLR-LV',supplier:'Hudson Materials',inStock:0,reserved:0,reorderAt:4,unit:'cans',unitCost:44,status:'Out of stock'}
];

export const tasks: TaskItem[] = [
  {id:'TSK-301',title:'Approve millwork drawings',projectId:'RV-2419',project:'Marlow Flagship',when:'Today · 11:30',dueIso:'2026-09-14T11:30:00',priority:'High',completed:false,assignee:'Mina Farrow'},
  {id:'TSK-302',title:'Send revised material estimate',projectId:'RV-2417',project:'Lumen Clinic Reception',when:'Today · 15:00',dueIso:'2026-09-14T15:00:00',priority:'Medium',completed:false,assignee:'Mina Farrow'},
  {id:'TSK-303',title:'Confirm delivery window',projectId:'RV-2408',project:'Aster Office Phase II',when:'Tomorrow',dueIso:'2026-09-15T09:00:00',priority:'Low',completed:false,assignee:'Sam Chen'},
  {id:'TSK-304',title:'Review signage proof',projectId:'RV-2413',project:'North & Pine Retail',when:'Sep 16',dueIso:'2026-09-16T10:00:00',priority:'High',completed:false,assignee:'Jon Bell'},
  {id:'TSK-305',title:'Archive completion documents',projectId:'RV-2401',project:'Sora Studio Fit-out',when:'Completed Sep 10',dueIso:'2026-09-10T16:00:00',priority:'Low',completed:true,assignee:'Mina Farrow'}
];

export const notifications: NotificationItem[] = [
  {id:'NT-1',title:'Budget variance warning',message:'Lumen Clinic Reception is 8.4% above the approved material allowance.',when:'18 min ago',unread:true,type:'risk'},
  {id:'NT-2',title:'Low-stock threshold reached',message:'Warm grey acoustic felt dropped below its reorder threshold.',when:'1 hour ago',unread:true,type:'inventory'},
  {id:'NT-3',title:'Client comment added',message:'Marlow Coffee commented on the millwork drawing set.',when:'2 hours ago',unread:true,type:'client'},
  {id:'NT-4',title:'Task due today',message:'Send revised material estimate before 15:00.',when:'3 hours ago',unread:true,type:'task'},
  {id:'NT-5',title:'Project moved to review',message:'Vale House Showroom is ready for internal review.',when:'Yesterday',unread:false,type:'task'}
];

export const revenueSeries = [
  {month:'Apr',value:48600},{month:'May',value:55200},{month:'Jun',value:61100},{month:'Jul',value:57800},{month:'Aug',value:73900},{month:'Sep',value:84600}
];
